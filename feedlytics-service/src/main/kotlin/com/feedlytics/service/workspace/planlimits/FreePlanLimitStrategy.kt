package com.feedlytics.service.workspace.planlimits

import com.feedlytics.service.workspace.entity.enums.PlansEnum
import org.springframework.stereotype.Component

@Component
class FreePlanLimitStrategy : PlanLimitStrategy {
    override val planType: PlansEnum = PlansEnum.FREE

    override fun toPlanLimit(): PlanLimit = PlanLimit(
        maxFeedbacksPerMonth = 100,
        maxApiCallsPerMonth = 1000,
        maxCampaigns = 1,
        maxMembers = 2,
        maxWidgets = 1,
        maxFeedbackCategoriesPerWorkspace = 3,
    )

    override fun isAccessible(): Boolean = true
}
