package com.feedlytics.service.feedback.dto.request

import com.feedlytics.service.feedback.entity.enums.SourceTypeEnum
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class SendFeedbackRequest(
    @field:NotBlank
    @field:Size(max = 5000)
    val content: String,
    @field:Min(0)
    @field:Max(5)
    val rating: Int,
    val sourceType: SourceTypeEnum,
)
