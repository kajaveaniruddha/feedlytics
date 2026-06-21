package com.feedlytics.service.notification.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.feedlytics.service.notification.InAppNotificationDedupeKeys
import com.feedlytics.service.notification.entity.InAppNotificationEntity
import com.feedlytics.service.notification.entity.NotificationDeliveryStatusEnum
import com.feedlytics.service.notification.entity.NotificationTypeEnum
import com.feedlytics.service.notification.redis.NotificationRedisPublisher
import com.feedlytics.service.notification.repository.InAppNotificationRepository
import com.feedlytics.service.notification.ws.NotificationWebSocketRegistry
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.ObjectProvider
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.transaction.support.TransactionSynchronization
import org.springframework.transaction.support.TransactionSynchronizationManager
import java.util.UUID

data class InAppNotificationCreateResult(
    val id: Long,
    val publicId: UUID,
    val created: Boolean,
)

@Service
class InAppNotificationApplicationService(
    private val repository: InAppNotificationRepository,
    private val objectMapper: ObjectMapper,
    private val deliveryService: InAppNotificationDeliveryService,
    private val redisPublisherProvider: ObjectProvider<NotificationRedisPublisher>,
    private val webSocketRegistry: NotificationWebSocketRegistry,
) {

    private val log = LoggerFactory.getLogger(javaClass)

    @Transactional
    fun createOrGetExisting(
        recipientUserId: Long,
        workspaceId: Long?,
        type: NotificationTypeEnum,
        dedupeKey: String,
        payload: Map<String, Any?>,
    ): InAppNotificationCreateResult {
        val existing = repository.findByRecipientUserIdAndDedupeKey(recipientUserId, dedupeKey).orElse(null)
        if (existing != null) {
            return InAppNotificationCreateResult(existing.id, existing.publicId, created = false)
        }
        val entity = InAppNotificationEntity(
            recipientUserId = recipientUserId,
            workspaceId = workspaceId,
            type = type,
            dedupeKey = dedupeKey,
            payload = payload,
            deliveryStatus = NotificationDeliveryStatusEnum.PENDING,
        )
        val saved = try {
            repository.saveAndFlush(entity)
        } catch (_: DataIntegrityViolationException) {
            val existing = repository.findByRecipientUserIdAndDedupeKey(recipientUserId, dedupeKey).orElseThrow()
            return InAppNotificationCreateResult(existing.id, existing.publicId, created = false)
        }
        log.info(
            "notification_issued publicId={} id={} userId={} type={} dedupeKey={} deliveryStatus={}",
            saved.publicId,
            saved.id,
            recipientUserId,
            type,
            dedupeKey,
            saved.deliveryStatus,
        )
        scheduleDispatchAfterCommit(saved)
        return InAppNotificationCreateResult(saved.id, saved.publicId, created = true)
    }

    private fun scheduleDispatchAfterCommit(entity: InAppNotificationEntity) {
        val snapshot = NotificationDispatchSnapshot(
            id = entity.id,
            publicId = entity.publicId,
            recipientUserId = entity.recipientUserId,
            type = entity.type.name,
            readAtNull = entity.readAt == null,
            deliveryStatus = entity.deliveryStatus.name,
            createdAt = entity.createdAt.toString(),
        )
        val runnable = Runnable {
            try {
                dispatchNew(snapshot)
            } catch (e: Exception) {
                log.warn("notification dispatch failed id={}: {}", snapshot.id, e.message)
                deliveryService.markFailed(snapshot.id, e.message ?: "dispatch_error")
            }
        }
        if (!TransactionSynchronizationManager.isSynchronizationActive()) {
            runnable.run()
            return
        }
        TransactionSynchronizationManager.registerSynchronization(
            object : TransactionSynchronization {
                override fun afterCommit() {
                    runnable.run()
                }
            },
        )
    }

    private fun dispatchNew(snapshot: NotificationDispatchSnapshot) {
        val envelope = linkedMapOf<String, Any?>(
            "event" to "notification.new",
            "publicId" to snapshot.publicId.toString(),
            "id" to snapshot.id,
            "type" to snapshot.type,
            "readStatus" to if (snapshot.readAtNull) "UNREAD" else "READ",
            "deliveryStatus" to "SENT",
            "createdAt" to snapshot.createdAt,
        )
        val json = objectMapper.writeValueAsString(envelope)
        val redis = redisPublisherProvider.ifAvailable
        if (redis != null) {
            try {
                redis.publish(snapshot.recipientUserId, envelope)
                deliveryService.markSent(snapshot.id)
                log.debug("notification_delivery_updated id={} status=SENT", snapshot.id)
            } catch (e: Exception) {
                deliveryService.markFailed(snapshot.id, e.message ?: "redis_publish_failed")
                log.warn("notification_delivery_updated id={} status=FAILED err={}", snapshot.id, e.message)
            }
        } else {
            webSocketRegistry.broadcastText(snapshot.recipientUserId, json)
            deliveryService.markSent(snapshot.id)
        }
    }

    fun publishRemoved(recipientUserId: Long, publicId: UUID) {
        val envelope = mapOf(
            "event" to "notification.removed",
            "publicId" to publicId.toString(),
        )
        val json = objectMapper.writeValueAsString(envelope)
        val redis = redisPublisherProvider.ifAvailable
        if (redis != null) {
            redis.publish(recipientUserId, envelope)
        } else {
            webSocketRegistry.broadcastText(recipientUserId, json)
        }
    }

    @Transactional
    fun deleteByRecipientAndDedupeKey(recipientUserId: Long, dedupeKey: String, reason: String): UUID? {
        val row = repository.findByRecipientUserIdAndDedupeKey(recipientUserId, dedupeKey).orElse(null)
            ?: return null
        val publicId = row.publicId
        log.info("notification_invite_consumed publicId={} userId={} reason={}", publicId, recipientUserId, reason)
        repository.delete(row)
        scheduleRemovedAfterCommit(recipientUserId, publicId)
        return publicId
    }

    private fun scheduleRemovedAfterCommit(recipientUserId: Long, publicId: UUID) {
        val runnable = Runnable { publishRemoved(recipientUserId, publicId) }
        if (!TransactionSynchronizationManager.isSynchronizationActive()) {
            runnable.run()
            return
        }
        TransactionSynchronizationManager.registerSynchronization(
            object : TransactionSynchronization {
                override fun afterCommit() {
                    runnable.run()
                }
            },
        )
    }

    fun dedupeKeyForInvitePending(inviteId: UUID): String = InAppNotificationDedupeKeys.invitePending(inviteId)
}

private data class NotificationDispatchSnapshot(
    val id: Long,
    val publicId: UUID,
    val recipientUserId: Long,
    val type: String,
    val readAtNull: Boolean,
    val deliveryStatus: String,
    val createdAt: String,
)
