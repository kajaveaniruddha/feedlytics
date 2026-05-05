package com.feedlytics.service.feedback.dto.response

import com.feedlytics.service.feedback.entity.enums.SourceTypeEnum
import java.time.Instant
import java.util.UUID

data class FeedbackItemResponse(
    val publicId: UUID,
    val sourceType: SourceTypeEnum,
    val content: String,
    val rating: Int,
    val createdAt: Instant,
    val updatedAt: Instant,
)
