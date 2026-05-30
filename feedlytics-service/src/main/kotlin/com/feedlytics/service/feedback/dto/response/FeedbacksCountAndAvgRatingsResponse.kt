package com.feedlytics.service.feedback.dto.response

import java.util.UUID

data class FeedbacksCountAndAvgRatingsResponse (
    val publicId : UUID,
    val totalFeedbacks: Long,
    val averageRating: Double
)
