package com.feedlytics.service.feedback.controller

import com.feedlytics.service.common.exception.UnauthorizedException
import com.feedlytics.service.common.http.FeedlyticsHttpHeaders
import com.feedlytics.service.feedback.dto.request.BatchAiAnalysisRequest
import com.feedlytics.service.feedback.service.FeedbackBatchAiAnalysisService
import jakarta.validation.Valid
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.security.MessageDigest

@RestController
@RequestMapping("/api/v1/internal/feedback")
class InternalBatchFeedbackAiController(
    @Value("\${feedlytics.internal.auth-token}")
    private val expectedToken: String,
    private val batchAiAnalysisService: FeedbackBatchAiAnalysisService,
) {

    @PostMapping("/batch-ai-analysis")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun batch(
        @RequestHeader(FeedlyticsHttpHeaders.INTERNAL_AUTH) token: String,
        @Valid @RequestBody body: BatchAiAnalysisRequest,
    ) {
        if (!constantTimeEquals(token, expectedToken)) {
            throw UnauthorizedException("INVALID_INTERNAL_AUTH", "Invalid internal authentication")
        }
        batchAiAnalysisService.persistBatch(body.items)
    }

    private fun constantTimeEquals(a: String, b: String): Boolean =
        MessageDigest.isEqual(a.toByteArray(Charsets.UTF_8), b.toByteArray(Charsets.UTF_8))
}
