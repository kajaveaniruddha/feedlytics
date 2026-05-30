package com.feedlytics.service.feedback.dto.response

data class FeedbackCategoryResponse(
    val id: Long,
    val name: String,
)

data class FeedbackCategoryListResponse(
    val categories: List<FeedbackCategoryResponse>,
    val maxCategories: Int,
)
