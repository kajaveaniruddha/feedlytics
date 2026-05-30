package com.feedlytics.service.workspace.planlimits

data class PlanLimit(
    val maxFeedbacksPerMonth: Int,
    val maxApiCallsPerMonth: Int,
    val maxCampaigns: Int,
    val maxMembers: Int,
    val maxWidgets: Int,
    val maxFeedbackCategoriesPerWorkspace: Int,
)
