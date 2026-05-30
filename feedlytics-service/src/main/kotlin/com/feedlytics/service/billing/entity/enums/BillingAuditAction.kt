package com.feedlytics.service.billing.entity.enums

enum class BillingAuditAction {
    SUBSCRIPTION_CREATED,
    PLAN_UPGRADED,
    PLAN_DOWNGRADED,
    SUBSCRIPTION_CANCELLED,
    SUBSCRIPTION_RENEWED,
    CHECKOUT_INITIATED,
    PORTAL_OPENED,
}
