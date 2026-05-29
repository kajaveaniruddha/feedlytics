package com.feedlytics.service.workspace.dto.response

import com.feedlytics.service.feedback.entity.enums.SourceTypeEnum
import com.feedlytics.service.workspace.entity.enums.PlansEnum
import java.time.Instant

data class WorkspacePlanUsageResponse(
    val success: Boolean = true,
    val plan: PlansEnum,
    val periodStart: Instant,
    val periodEnd: Instant,
    val monthlyFeedback: WorkspacePlanUsageMetric,
    val feedbacksBySourceType: List<WorkspacePlanUsageBySourceType>,
    val members: WorkspacePlanUsageMetric,
)

data class WorkspacePlanUsageMetric(
    val used: Long,
    val limit: Int,
)

data class WorkspacePlanUsageBySourceType(
    val sourceType: SourceTypeEnum,
    val used: Long,
    val limit: Int,
    val limitKind: WorkspacePlanUsageLimitKind,
)

enum class WorkspacePlanUsageLimitKind {
    API_MONTHLY,
    SHARED_MONTHLY_FEEDBACK,
}
