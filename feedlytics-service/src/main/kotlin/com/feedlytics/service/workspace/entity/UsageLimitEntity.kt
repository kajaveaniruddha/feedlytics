package com.feedlytics.service.workspace.entity

import jakarta.persistence.*
import java.time.Instant

@Entity
@Table(name = "usage_limits")
class UsageLimitEntity(
    @Column(name = "workspace_id", nullable = false)
    val workspaceId: Long,

    @Column(name = "feedback_count", nullable = false)
    var feedbackCount: Int = 0,

    @Column(name = "api_calls", nullable = false)
    var apiCalls: Int = 0,

    @Column(name = "campaign_count", nullable = false)
    var campaignCount: Int = 0,

    @Column(name = "period_start", nullable = false)
    val periodStart: Instant
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: Instant = Instant.now()

    @Column(name = "updated_at", nullable = false)
    var updatedAt: Instant = Instant.now()

    @PreUpdate
    fun onUpdate() {
        updatedAt = Instant.now()
    }
}
