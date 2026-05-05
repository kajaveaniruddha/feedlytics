package com.feedlytics.service.feedback.controller

import com.feedlytics.service.common.http.FeedlyticsHttpHeaders
import com.feedlytics.service.feedback.dto.request.SendFeedbackRequest
import com.feedlytics.service.feedback.service.PublicSendFeedbackService
import jakarta.servlet.http.HttpServletRequest
import jakarta.validation.Valid
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/v1/workspaces")
class PublicSendFeedbackController(
    private val publicSendFeedbackService: PublicSendFeedbackService,
) {

    @PostMapping("/{workspacePublicId}/send-feedback")
    @ResponseStatus(HttpStatus.ACCEPTED)
    fun sendFeedback(
        @PathVariable workspacePublicId: UUID,
        @Valid @RequestBody body: SendFeedbackRequest,
        @RequestHeader(FeedlyticsHttpHeaders.API_KEY, required = false) apiKey: String?,
        @RequestHeader(FeedlyticsHttpHeaders.WIDGET_SECRET, required = false) widgetSecret: String?,
        @RequestHeader(value = HttpHeaders.ORIGIN, required = false) origin: String?,
        request: HttpServletRequest,
    ): Map<String, Long> {
        val feedbackId = publicSendFeedbackService.send(
            workspacePublicId = workspacePublicId,
            body = body,
            apiKey = apiKey,
            widgetSecret = widgetSecret,
            origin = origin,
            remoteIp = clientIp(request),
            userAgent = request.getHeader(HttpHeaders.USER_AGENT),
        )
        return mapOf("feedbackId" to feedbackId)
    }

    private fun clientIp(request: HttpServletRequest): String? {
        val forwarded = request.getHeader("X-Forwarded-For")?.split(",")?.firstOrNull()?.trim()
        return forwarded?.ifEmpty { null } ?: request.remoteAddr?.takeIf { it.isNotBlank() }
    }
}
