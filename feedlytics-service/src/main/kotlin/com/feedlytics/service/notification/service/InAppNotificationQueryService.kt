package com.feedlytics.service.notification.service

import com.feedlytics.service.common.exception.NotFoundException
import com.feedlytics.service.notification.dto.NotificationListResponseDto
import com.feedlytics.service.notification.dto.NotificationResponseDto
import com.feedlytics.service.notification.entity.NotificationTypeEnum
import com.feedlytics.service.notification.repository.InAppNotificationRepository
import com.feedlytics.service.workspace.repository.WorkspaceRepository
import org.slf4j.LoggerFactory
import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.Base64
import java.util.UUID

@Service
class InAppNotificationQueryService(
    private val repository: InAppNotificationRepository,
    private val workspaceRepository: WorkspaceRepository,
) {

    private val log = LoggerFactory.getLogger(javaClass)

    @Transactional(readOnly = true)
    fun list(
        userId: Long,
        cursor: String?,
        limit: Int,
        readStatus: String,
        typeFilter: String?,
        workspacePublicId: UUID?,
    ): NotificationListResponseDto {
        val type = typeFilter?.let { NotificationTypeEnum.valueOf(it) }
        val workspaceId = workspacePublicId?.let {
            workspaceRepository.findByPublicId(it)?.id
        }
        val readParam = when (readStatus.uppercase()) {
            "UNREAD" -> "UNREAD"
            "READ" -> "READ"
            else -> "ALL"
        }
        val beforeId = cursor?.let { decodeCursor(it) }
        val pageable = PageRequest.of(0, limit + 1)

        log.debug(
            "notifications.query.list userId={} beforeId={} type={} workspaceId={} readStatus={} limit={}",
            userId,
            beforeId,
            type,
            workspaceId,
            readParam,
            limit,
        )

        val rows = repository.listInboxForUser(
            userId = userId,
            beforeId = beforeId,
            type = type,
            workspaceId = workspaceId,
            readStatus = readParam,
            pageable = pageable,
        )
        val hasMore = rows.size > limit
        val page = if (hasMore) rows.take(limit) else rows
        val items = page.map { entity ->
            val wsPublic = entity.workspaceId?.let { wid ->
                workspaceRepository.findById(wid).orElse(null)?.publicId
            }
            NotificationResponseDto.fromEntity(entity, wsPublic)
        }
        val nextCursor = if (hasMore && page.isNotEmpty()) {
            encodeCursor(page.last().id)
        } else {
            null
        }
        log.debug(
            "notifications.query.list.result userId={} returned={} hasMore={}",
            userId,
            page.size,
            hasMore,
        )
        return NotificationListResponseDto(items, nextCursor, hasMore)
    }

    @Transactional(readOnly = true)
    fun getByPublicId(userId: Long, publicId: UUID): NotificationResponseDto {
        log.debug("notifications.query.getById userId={} publicId={}", userId, publicId)
        val entity = repository.findByRecipientUserIdAndPublicId(userId, publicId)
            .orElseThrow { NotFoundException("NOTIFICATION_NOT_FOUND", "Notification not found") }
        val wsPublic = entity.workspaceId?.let { wid ->
            workspaceRepository.findById(wid).orElse(null)?.publicId
        }
        return NotificationResponseDto.fromEntity(entity, wsPublic)
    }

    @Transactional(readOnly = true)
    fun unreadCount(userId: Long, workspacePublicId: UUID?): Long {
        val workspaceId = workspacePublicId?.let {
            workspaceRepository.findByPublicId(it)?.id
        }
        val count = if (workspaceId == null) {
            repository.countByRecipientUserIdAndReadAtIsNull(userId)
        } else {
            repository.countByRecipientUserIdAndReadAtIsNullAndWorkspaceId(userId, workspaceId)
        }
        log.debug("notifications.query.unreadCount userId={} workspaceId={} count={}", userId, workspaceId, count)
        return count
    }

    private fun encodeCursor(id: Long): String =
        Base64.getUrlEncoder().withoutPadding().encodeToString("""{"id":$id}""".toByteArray())

    private fun decodeCursor(cursor: String): Long {
        val json = String(Base64.getUrlDecoder().decode(cursor))
        val match = """"id"\s*:\s*(\d+)""".toRegex().find(json)
            ?: throw IllegalArgumentException("Invalid cursor")
        return match.groupValues[1].toLong()
    }
}
