package com.feedlytics.service.notification.dto

import com.feedlytics.service.notification.entity.InAppNotificationEntity
import java.time.Instant
import java.util.UUID

data class NotificationResponseDto(
    val publicId: UUID,
    val type: String,
    val readStatus: String,
    val readAt: Instant?,
    val deliveryStatus: String,
    val workspacePublicId: UUID?,
    val payload: Map<String, Any?>,
    val createdAt: Instant,
    val updatedAt: Instant,
) {
    companion object {
        fun fromEntity(entity: InAppNotificationEntity, workspacePublicId: UUID?): NotificationResponseDto =
            NotificationResponseDto(
                publicId = entity.publicId,
                type = entity.type.name,
                readStatus = if (entity.readAt == null) "UNREAD" else "READ",
                readAt = entity.readAt,
                deliveryStatus = entity.deliveryStatus.name,
                workspacePublicId = workspacePublicId,
                payload = entity.payload,
                createdAt = entity.createdAt,
                updatedAt = entity.updatedAt,
            )
    }
}

data class NotificationListResponseDto(
    val items: List<NotificationResponseDto>,
    val nextCursor: String?,
    val hasMore: Boolean,
)
