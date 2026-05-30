package com.feedlytics.service.feedback.dto.request

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class CreateFeedbackCategoryRequest(
    @field:NotBlank
    @field:Size(max = 255)
    val name: String,
)
