package com.feedlytics.service.workspace.planlimits

import com.feedlytics.service.workspace.entity.enums.PlansEnum
import org.springframework.stereotype.Component

@Component
class ProPlanLimitStrategy : PlanLimitStrategy {
    override val planType: PlansEnum = PlansEnum.PRO

    override fun toPlanLimit(): PlanLimit = PlanLimit(
        maxFeedbacksPerMonth = 5000,
        maxApiCallsPerMonth = 50000,
        maxCampaigns = 10,
        maxMembers = 10,
        maxWidgets = 5,
        maxFeedbackCategoriesPerWorkspace = 6,
    )

    override fun isAccessible(): Boolean = true
}
