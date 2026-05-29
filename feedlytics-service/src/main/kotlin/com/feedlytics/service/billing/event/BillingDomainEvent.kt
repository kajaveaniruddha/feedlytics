package com.feedlytics.service.billing.event

import com.feedlytics.service.workspace.entity.enums.PlansEnum

sealed class BillingDomainEvent {

    data class CheckoutCompleted(
        val workspaceId: Long,
        val stripeCustomerId: String,
        val stripeSubscriptionId: String,
        val priceId: String,
        val plan: PlansEnum,
        val interval: String,
        val stripeEventId: String,
    ) : BillingDomainEvent()

    data class SubscriptionUpdated(
        val workspaceId: Long,
        val stripeCustomerId: String,
        val priceId: String,
        val previousPlan: PlansEnum?,
        val newPlan: PlansEnum,
        val interval: String,
        val stripeEventId: String,
    ) : BillingDomainEvent()

    data class SubscriptionDeleted(
        val workspaceId: Long,
        val stripeCustomerId: String,
        val previousPlan: PlansEnum?,
        val stripeEventId: String,
    ) : BillingDomainEvent()

    data class InvoicePaid(
        val workspaceId: Long,
        val stripeCustomerId: String,
        val stripeEventId: String,
    ) : BillingDomainEvent()

    data class CheckoutInitiated(
        val workspaceId: Long,
        val userId: Long,
        val plan: PlansEnum,
        val interval: String,
    ) : BillingDomainEvent()

    data class PortalOpened(
        val workspaceId: Long,
        val userId: Long,
    ) : BillingDomainEvent()
}
