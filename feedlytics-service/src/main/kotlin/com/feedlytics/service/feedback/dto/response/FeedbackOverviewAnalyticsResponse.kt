package com.feedlytics.service.feedback.dto.response

import java.util.UUID

data class FeedbackOverviewAnalyticsResponse (
    val publicId: UUID,
    val totalFeedbacks: Long,
    val averageRating: Double,
    val topCategory: String,
    val positiveSentimentPercentage: Double,
    val sentimentCounts: SentimentCounts,
    val categories: CategoryAnalyticsBreakdown,
    val rolling30DayFeedbacks: RollingFeedbackTrend,
) {
    companion object {
        const val NO_CATEGORIES_MESSAGE: String = "No categories set. Please set the categories."

        fun empty(publicId: UUID) = FeedbackOverviewAnalyticsResponse(
            publicId = publicId,
            totalFeedbacks = 0L,
            averageRating = 0.0,
            topCategory = "NONE",
            positiveSentimentPercentage = 0.0,
            sentimentCounts = SentimentCounts(),
            categories = CategoryAnalyticsBreakdown.notConfigured(NO_CATEGORIES_MESSAGE),
            rolling30DayFeedbacks = RollingFeedbackTrend.empty(),
        )
    }
}

data class RollingFeedbackTrend(
    val count: Long,
    val previousPeriodCount: Long,
    val changePercent: Double,
    val dailyCounts: List<DailyFeedbackCount>,
) {
    companion object {
        fun empty(): RollingFeedbackTrend = RollingFeedbackTrend(
            count = 0L,
            previousPeriodCount = 0L,
            changePercent = 0.0,
            dailyCounts = emptyList(),
        )
    }
}

data class DailyFeedbackCount(
    val date: String,
    val count: Long,
)

data class SentimentCounts(
    val positive: Long = 0L,
    val negative: Long = 0L,
    val neutral: Long = 0L,
)

enum class CategoryAnalyticsState {
    READY,
    NOT_CONFIGURED,
}

data class CategoryAnalyticsItem(
    val id: Long,
    val name: String,
    val feedbackCount: Long,
)

data class CategoryAnalyticsBreakdown(
    val state: CategoryAnalyticsState,
    val items: List<CategoryAnalyticsItem>? = null,
    val otherCount: Long? = null,
    val message: String? = null,
) {
    companion object {
        fun ready(items: List<CategoryAnalyticsItem>, otherCount: Long): CategoryAnalyticsBreakdown =
            CategoryAnalyticsBreakdown(
                state = CategoryAnalyticsState.READY,
                items = items,
                otherCount = otherCount,
            )

        fun notConfigured(message: String): CategoryAnalyticsBreakdown =
            CategoryAnalyticsBreakdown(
                state = CategoryAnalyticsState.NOT_CONFIGURED,
                message = message,
            )
    }
}
