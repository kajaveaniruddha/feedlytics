package com.feedlytics.service.workspace.entity

import com.feedlytics.service.workspace.entity.enums.InviteStatusEnum
import com.feedlytics.service.workspace.entity.enums.WorkspaceRoleEnum
import jakarta.persistence.*
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "invites")
class InviteEntity(
    @Column(name = "workspace_id", nullable = false)
    val workspaceId: Long,

    @Column(nullable = false)
    val email: String,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val role: WorkspaceRoleEnum,

    @Column(nullable = false, unique = true)
    val token: String,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var status: InviteStatusEnum = InviteStatusEnum.PENDING,

    @Column(name = "expires_at", nullable = false)
    val expiresAt: Instant
) {
    @Id
    val id: UUID = UUID.randomUUID()

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: Instant = Instant.now()

    @Column(name = "updated_at", nullable = false)
    var updatedAt: Instant = Instant.now()

    @PreUpdate
    fun onUpdate() {
        updatedAt = Instant.now()
    }

    fun isExpired(): Boolean = Instant.now().isAfter(expiresAt)

    fun isPending(): Boolean = status == InviteStatusEnum.PENDING && !isExpired()
}
