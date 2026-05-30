package com.feedlytics.service.billing.dto.request

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Pattern

data class CheckoutSessionRequest(
    @field:Pattern(regexp = "PRO|BUSINESS", message = "Plan must be PRO or BUSINESS")
    @field:NotBlank
    val plan: String,

    @field:Pattern(regexp = "monthly|yearly", message = "Interval must be monthly or yearly")
    @field:NotBlank
    val interval: String,
)
