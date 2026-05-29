package com.feedlytics.service.billing.config

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "stripe")
data class StripeProperties(
    val secretKey: String,
    val webhookSecret: String,
    val price: PriceProperties,
) {
    data class PriceProperties(
        val pro: IntervalPriceProperties,
        val business: IntervalPriceProperties,
    )

    data class IntervalPriceProperties(
        val monthly: String,
        val yearly: String,
    )
}
