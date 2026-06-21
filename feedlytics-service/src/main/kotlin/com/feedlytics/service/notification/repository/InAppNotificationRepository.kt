package com.feedlytics.service.notification.repository

import com.feedlytics.service.notification.entity.InAppNotificationEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.util.Optional
import java.util.UUID

interface InAppNotificationRepository :
    JpaRepository<InAppNotificationEntity, Long>,
    InAppNotificationRepositoryCustom {

    fun findByRecipientUserIdAndPublicId(
        recipientUserId: Long,
        publicId: UUID,
    ): Optional<InAppNotificationEntity>

    fun findByRecipientUserIdAndDedupeKey(
        recipientUserId: Long,
        dedupeKey: String,
    ): Optional<InAppNotificationEntity>

    fun countByRecipientUserIdAndReadAtIsNull(recipientUserId: Long): Long

    fun countByRecipientUserIdAndReadAtIsNullAndWorkspaceId(
        recipientUserId: Long,
        workspaceId: Long,
    ): Long

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
