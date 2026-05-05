package com.feedlytics.service.feedback.dto.response

import java.util.UUID

data class FeedbackOverviewAnalyticsResponse (
    val publicId: UUID,
    val totalFeedbacks: Long,
    val averageRating: Double,
    val topCategory: String,
    val positiveSentimentPercentage: Double,
) {
    companion object {
        fun empty(publicId: UUID) = FeedbackOverviewAnalyticsResponse(
            publicId = publicId,
            totalFeedbacks = 0L,
            averageRating = 0.0,
            topCategory = "NONE",
            positiveSentimentPercentage = 0.0,
        )
    }
}
