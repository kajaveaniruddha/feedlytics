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
    @field:Min(1)
    @field:Max(5)
    val rating: Int,
    val sourceType: SourceTypeEnum,
    /** Optional client-reported IP; used only when server cannot determine IP (untrusted). */
    @field:Size(max = 100)
    val reportedIp: String? = null,
    /** Optional client-reported user agent; used only when server header is missing. */
    @field:Size(max = 2000)
    val reportedUserAgent: String? = null,
    @field:Size(max = 200)
    val submitterName: String? = null,
    @field:Size(max = 320)
    val submitterEmail: String? = null,
    /** Optional client-reported location label (e.g. coarse geo); stored on feedback_metadata.location. */
    @field:Size(max = 500)
    val reportedLocation: String? = null,
)
