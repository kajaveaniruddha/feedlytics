package com.feedlytics.service.billing.dto.response

data class CheckoutSessionResponse(
    val success: Boolean = true,
    val url: String,
)
