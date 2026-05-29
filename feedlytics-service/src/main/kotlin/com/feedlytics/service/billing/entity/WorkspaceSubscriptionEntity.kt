package com.feedlytics.service.billing.entity

import com.feedlytics.service.billing.entity.enums.SubscriptionStatusEnum
import com.feedlytics.service.common.entity.BaseEntity
import com.feedlytics.service.workspace.entity.enums.PlansEnum
import jakarta.persistence.*
import java.time.Instant

@Entity
@Table(name = "workspace_subscriptions")
class WorkspaceSubscriptionEntity(
    @Column(name = "workspace_id", nullable = false)
    val workspaceId: Long,

    @Column(name = "stripe_customer_id", nullable = false)
    val stripeCustomerId: String,

    @Column(name = "stripe_subscription_id", nullable = false, unique = true)
    val stripeSubscriptionId: String,

    @Column(name = "stripe_price_id", nullable = false)
    var stripePriceId: String,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var plan: PlansEnum,

    @Column(name = "billing_interval", nullable = false, length = 10)
    var billingInterval: String,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var status: SubscriptionStatusEnum = SubscriptionStatusEnum.ACTIVE,

    @Column(name = "current_period_start")
    var currentPeriodStart: Instant? = null,

    @Column(name = "current_period_end")
    var currentPeriodEnd: Instant? = null,

    @Column(name = "cancelled_at")
    var cancelledAt: Instant? = null,
) : BaseEntity()
