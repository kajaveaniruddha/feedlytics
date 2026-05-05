package com.feedlytics.service.workspace.config

import com.feedlytics.service.workspace.entity.enums.PlansEnum

data class PlanLimit(
    val maxFeedbacksPerMonth: Int,
    val maxApiCallsPerMonth: Int,
    val maxCampaigns: Int,
    val maxMembers: Int,
    val maxWidgets: Int,
    val maxFeedbackCategoriesPerWorkspace: Int,
)

object PlanLimits {
    private val limits = mapOf(
        PlansEnum.FREE to PlanLimit(
            maxFeedbacksPerMonth = 100,
            maxApiCallsPerMonth = 1000,
            maxCampaigns = 1,
            maxMembers = 2,
            maxWidgets = 1,
            maxFeedbackCategoriesPerWorkspace = 3,
        ),
        PlansEnum.PRO to PlanLimit(
            maxFeedbacksPerMonth = 5000,
            maxApiCallsPerMonth = 50000,
            maxCampaigns = 10,
            maxMembers = 10,
            maxWidgets = 5,
            maxFeedbackCategoriesPerWorkspace = 6,
        ),
        PlansEnum.BUSINESS to PlanLimit(
            maxFeedbacksPerMonth = 20000,
            maxApiCallsPerMonth = 200000,
            maxCampaigns = 50,
            maxMembers = 50,
            maxWidgets = 10,
            maxFeedbackCategoriesPerWorkspace = 10,
        ),
        PlansEnum.ARCHIVED to PlanLimit(
            maxFeedbacksPerMonth = 0,
            maxApiCallsPerMonth = 0,
            maxCampaigns = 0,
            maxMembers = 0,
            maxWidgets = 0,
            maxFeedbackCategoriesPerWorkspace = 0,
        )
    )

    const val MAX_FREE_WORKSPACES_PER_USER = 3

    fun forPlan(plan: PlansEnum): PlanLimit = limits.getValue(plan)

    fun isAccessible(plan: PlansEnum): Boolean = plan != PlansEnum.ARCHIVED
}
