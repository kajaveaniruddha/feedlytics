package com.feedlytics.service.feedback.dto.response

data class FeedbacksListResponse(
    val feedbacks: List<FeedbackItemResponse>,
    val page: Int,
    val size: Int,
    val totalElements: Long,
    val totalPages: Int,
)
