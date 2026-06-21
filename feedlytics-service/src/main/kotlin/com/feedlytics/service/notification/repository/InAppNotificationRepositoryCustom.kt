package com.feedlytics.service.notification.repository

import com.feedlytics.service.notification.entity.InAppNotificationEntity
import com.feedlytics.service.notification.entity.NotificationTypeEnum
import org.springframework.data.domain.Pageable

/**
 * Criteria-based inbox listing so PostgreSQL enum columns bind correctly
 * (JPQL `(param IS NULL OR col = param)` breaks PG parameter typing for enums).
 */
interface InAppNotificationRepositoryCustom {

    fun listInboxForUser(
        userId: Long,
        beforeId: Long?,
        type: NotificationTypeEnum?,
        workspaceId: Long?,
        readStatus: String,
        pageable: Pageable,
    ): List<InAppNotificationEntity>
}
