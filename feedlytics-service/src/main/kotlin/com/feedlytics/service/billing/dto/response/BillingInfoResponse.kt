package com.feedlytics.service.billing.dto.response

import com.feedlytics.service.workspace.entity.enums.PlansEnum

data class BillingInfoResponse(
    val success: Boolean = true,
    val plan: PlansEnum,
    val billingInterval: String?,
    val hasSubscription: Boolean,
    val stripeSubscriptionId: String?,
    val canManageBilling: Boolean,
    val subscriptionStatus: String? = null,
    val currentPeriodEnd: String? = null,
)
