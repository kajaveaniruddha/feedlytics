package com.feedlytics.service.feedback.dto.request

import jakarta.validation.Valid
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.NotNull

data class BatchAiAnalysisRequest(
    @field:NotEmpty
    @field:Valid
    val items: List<BatchAiAnalysisItemRequest>,
)

data class BatchAiAnalysisItemRequest(
    @field:NotNull
    val feedbackId: Long,
    @field:NotNull
    val sentiment: String,
    @field:NotNull
    val overallConfidence: Double,
    @field:Valid
    val categories: List<CategoryAssignmentRequest> = emptyList(),
)

data class CategoryAssignmentRequest(
    @field:NotNull
    val categoryName: String,
    val confidence: Double? = null,
)
