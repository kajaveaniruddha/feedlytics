package com.feedlytics.service.notification.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.PreUpdate
import jakarta.persistence.Table
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "in_app_notifications")
class InAppNotificationEntity(
    @Column(name = "recipient_user_id", nullable = false)
    val recipientUserId: Long,

    @Column(name = "workspace_id")
    val workspaceId: Long?,

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, columnDefinition = "notification_type")
    val type: NotificationTypeEnum,

    @Column(name = "dedupe_key", nullable = false, length = 255)
    val dedupeKey: String,

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "payload", nullable = false, columnDefinition = "jsonb")
    var payload: Map<String, Any?>,

    @Column(name = "read_at")
    var readAt: Instant? = null,

    @Enumerated(EnumType.STRING)
    @Column(name = "delivery_status", nullable = false, columnDefinition = "notification_delivery_status")
    var deliveryStatus: NotificationDeliveryStatusEnum = NotificationDeliveryStatusEnum.PENDING,

    @Column(name = "delivery_error", columnDefinition = "TEXT")
    var deliveryError: String? = null,
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0

    @Column(name = "public_id", nullable = false, unique = true, updatable = false)
    val publicId: UUID = UUID.randomUUID()

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: Instant = Instant.now()

    @Column(name = "updated_at", nullable = false)
    var updatedAt: Instant = Instant.now()

    @PreUpdate
    fun touchUpdatedAt() {
        updatedAt = Instant.now()
    }
}
