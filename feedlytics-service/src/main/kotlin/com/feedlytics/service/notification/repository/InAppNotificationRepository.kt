package com.feedlytics.service.notification.repository

import com.feedlytics.service.notification.entity.InAppNotificationEntity
import com.feedlytics.service.notification.entity.NotificationTypeEnum
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.util.Optional
import java.util.UUID

interface InAppNotificationRepository : JpaRepository<InAppNotificationEntity, Long> {

    fun findByRecipientUserIdAndPublicId(
        recipientUserId: Long,
        publicId: UUID,
    ): Optional<InAppNotificationEntity>

    fun findByRecipientUserIdAndDedupeKey(
        recipientUserId: Long,
        dedupeKey: String,
    ): Optional<InAppNotificationEntity>

    @Query(
        """
        SELECT n FROM InAppNotificationEntity n
        WHERE n.recipientUserId = :userId
          AND (:beforeId IS NULL OR n.id < :beforeId)
          AND (:type IS NULL OR n.type = :type)
          AND (:workspaceId IS NULL OR n.workspaceId = :workspaceId)
          AND (
            :readStatus = 'ALL'
            OR (:readStatus = 'UNREAD' AND n.readAt IS NULL)
            OR (:readStatus = 'READ' AND n.readAt IS NOT NULL)
          )
        ORDER BY n.id DESC
        """,
    )
    fun listForUser(
        @Param("userId") userId: Long,
        @Param("beforeId") beforeId: Long?,
        @Param("type") type: NotificationTypeEnum?,
        @Param("workspaceId") workspaceId: Long?,
        @Param("readStatus") readStatus: String,
        pageable: Pageable,
    ): List<InAppNotificationEntity>

    @Query(
        """
        SELECT COUNT(n) FROM InAppNotificationEntity n
        WHERE n.recipientUserId = :userId
          AND n.readAt IS NULL
          AND (:workspaceId IS NULL OR n.workspaceId = :workspaceId)
        """,
    )
    fun countUnread(@Param("userId") userId: Long, @Param("workspaceId") workspaceId: Long?): Long

    @Modifying
    @Query(
        """
        DELETE FROM InAppNotificationEntity n
        WHERE n.recipientUserId = :userId AND n.dedupeKey = :dedupeKey
        """,
    )
    fun deleteByRecipientUserIdAndDedupeKey(
        @Param("userId") userId: Long,
        @Param("dedupeKey") dedupeKey: String,
    ): Int
}
