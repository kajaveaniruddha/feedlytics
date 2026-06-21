package com.feedlytics.service.notification.repository

import com.feedlytics.service.notification.entity.InAppNotificationEntity
import com.feedlytics.service.notification.entity.NotificationTypeEnum
import jakarta.persistence.EntityManager
import jakarta.persistence.PersistenceContext
import jakarta.persistence.criteria.Predicate
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Repository
import java.time.Instant

@Repository
class InAppNotificationRepositoryImpl(
    @PersistenceContext
    private val entityManager: EntityManager,
) : InAppNotificationRepositoryCustom {

    override fun listInboxForUser(
        userId: Long,
        beforeId: Long?,
        type: NotificationTypeEnum?,
        workspaceId: Long?,
        readStatus: String,
        pageable: Pageable,
    ): List<InAppNotificationEntity> {
        val cb = entityManager.criteriaBuilder
        val cq = cb.createQuery(InAppNotificationEntity::class.java)
        val root = cq.from(InAppNotificationEntity::class.java)
        val predicates = mutableListOf<Predicate>()

        predicates.add(cb.equal(root.get<Long>("recipientUserId"), userId))

        beforeId?.let { predicates.add(cb.lessThan(root.get<Long>("id"), it)) }

        type?.let { predicates.add(cb.equal(root.get<NotificationTypeEnum>("type"), it)) }

        workspaceId?.let { predicates.add(cb.equal(root.get<Long>("workspaceId"), it)) }

        when (readStatus.uppercase()) {
            "UNREAD" -> predicates.add(cb.isNull(root.get<Instant>("readAt")))
            "READ" -> predicates.add(cb.isNotNull(root.get<Instant>("readAt")))
        }

        cq.where(*predicates.toTypedArray())
        cq.orderBy(cb.desc(root.get<Long>("id")))

        val query = entityManager.createQuery(cq)
        query.maxResults = pageable.pageSize

        return query.resultList
    }
}
