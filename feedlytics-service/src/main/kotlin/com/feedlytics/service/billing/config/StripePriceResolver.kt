package com.feedlytics.service.billing.config

import com.feedlytics.service.workspace.entity.enums.PlansEnum
import org.springframework.stereotype.Component

data class ResolvedPlan(
    val plan: PlansEnum,
    val interval: String,
)

@Component
class StripePriceResolver(
    private val stripeProperties: StripeProperties,
) {
    private val planToPriceId: Map<Pair<PlansEnum, String>, String> by lazy {
        mapOf(
            (PlansEnum.PRO to "monthly") to stripeProperties.price.pro.monthly,
            (PlansEnum.PRO to "yearly") to stripeProperties.price.pro.yearly,
            (PlansEnum.BUSINESS to "monthly") to stripeProperties.price.business.monthly,
            (PlansEnum.BUSINESS to "yearly") to stripeProperties.price.business.yearly,
        )
    }

    private val priceIdToPlan: Map<String, ResolvedPlan> by lazy {
        planToPriceId.entries.associate { (key, priceId) ->
            priceId to ResolvedPlan(plan = key.first, interval = key.second)
        }
    }

    fun getPriceId(plan: PlansEnum, interval: String): String? =
        planToPriceId[plan to interval]

    fun resolvePlan(priceId: String): ResolvedPlan? =
        priceIdToPlan[priceId]
}
