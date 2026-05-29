package com.feedlytics.service.workspace.planlimits

import com.feedlytics.service.workspace.entity.enums.PlansEnum
import org.springframework.stereotype.Component

@Component
class BusinessPlanLimitStrategy : PlanLimitStrategy {
    override val planType: PlansEnum = PlansEnum.BUSINESS

    override fun toPlanLimit(): PlanLimit = PlanLimit(
        maxFeedbacksPerMonth = 20000,
        maxApiCallsPerMonth = 200000,
        maxCampaigns = 50,
        maxMembers = 50,
        maxWidgets = 10,
        maxFeedbackCategoriesPerWorkspace = 10,
    )

    override fun isAccessible(): Boolean = true
}
