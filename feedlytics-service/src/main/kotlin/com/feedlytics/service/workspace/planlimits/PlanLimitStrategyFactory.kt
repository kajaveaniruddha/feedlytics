package com.feedlytics.service.workspace.planlimits

import com.feedlytics.service.workspace.entity.enums.PlansEnum
import org.springframework.stereotype.Component

@Component
class PlanLimitStrategyFactory(
    strategies: List<PlanLimitStrategy>,
) {
    private val strategyByPlan: Map<PlansEnum, PlanLimitStrategy> =
        strategies.associateBy { it.planType }

    fun getStrategy(plan: PlansEnum): PlanLimitStrategy =
        strategyByPlan[plan]
            ?: throw IllegalArgumentException("Unsupported plan: $plan")
}
