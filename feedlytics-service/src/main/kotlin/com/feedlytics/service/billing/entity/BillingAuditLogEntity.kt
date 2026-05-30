package com.feedlytics.service.billing.entity

import com.feedlytics.service.billing.entity.enums.AuditActorType
import com.feedlytics.service.billing.entity.enums.BillingAuditAction
import jakarta.persistence.*
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import java.time.Instant

@Entity
@Table(name = "billing_audit_logs")
class BillingAuditLogEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(name = "workspace_id", nullable = false)
    val workspaceId: Long,

    @Enumerated(EnumType.STRING)
    @Column(name = "actor_type", nullable = false, length = 20)
    val actorType: AuditActorType,

    @Column(name = "actor_id")
    val actorId: String? = null,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    val action: BillingAuditAction,

    @Column(name = "previous_plan", length = 50)
    val previousPlan: String? = null,

    @Column(name = "new_plan", length = 50)
    val newPlan: String? = null,

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    val metadata: String? = null,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: Instant = Instant.now(),
)
