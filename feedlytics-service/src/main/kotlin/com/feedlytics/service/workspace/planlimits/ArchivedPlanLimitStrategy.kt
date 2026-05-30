package com.feedlytics.service.workspace.planlimits

import com.feedlytics.service.workspace.entity.enums.PlansEnum
import org.springframework.stereotype.Component

@Component
class ArchivedPlanLimitStrategy : PlanLimitStrategy {
    override val planType: PlansEnum = PlansEnum.ARCHIVED

    override fun toPlanLimit(): PlanLimit = PlanLimit(
        maxFeedbacksPerMonth = 0,
        maxApiCallsPerMonth = 0,
        maxCampaigns = 0,
        maxMembers = 0,
        maxWidgets = 0,
        maxFeedbackCategoriesPerWorkspace = 0,
    )

    override fun isAccessible(): Boolean = false
}
