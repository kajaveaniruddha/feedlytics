package com.feedlytics.service.workspace.service

import com.feedlytics.service.workspace.dto.UsageInfoDto
import com.feedlytics.service.workspace.entity.enums.PlansEnum

interface UsageLimitService {

    fun canSubmitFeedback(workspaceId: Long, plan: PlansEnum): Boolean

    fun canMakeApiCall(workspaceId: Long, plan: PlansEnum): Boolean

    fun canCreateCampaign(workspaceId: Long, plan: PlansEnum): Boolean

    fun incrementFeedbackCount(workspaceId: Long, plan: PlansEnum, feedbackId: Long)

    fun incrementApiCalls(workspaceId: Long, plan: PlansEnum)

    fun incrementCampaignCount(workspaceId: Long, plan: PlansEnum)

    fun decrementCampaignCount(workspaceId: Long)

    fun getCurrentUsage(workspaceId: Long): UsageInfoDto
}
