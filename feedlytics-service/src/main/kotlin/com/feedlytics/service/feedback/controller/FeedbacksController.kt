package com.feedlytics.service.feedback.controller

import com.feedlytics.service.common.security.AuthenticatedUser
import com.feedlytics.service.feedback.dto.response.FeedbackOverviewAnalyticsResponse
import com.feedlytics.service.feedback.dto.response.FeedbacksListResponse
import com.feedlytics.service.feedback.service.FeedbacksService
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/v1/workspaces/{workspaceId}/feedbacks")
class FeedbacksController(
    private val feedbacksService: FeedbacksService,
) {

    private val log = LoggerFactory.getLogger(FeedbacksController::class.java)

    @GetMapping
    fun listFeedbacks(
        @AuthenticationPrincipal user: AuthenticatedUser,
        @PathVariable workspaceId: UUID,
        @RequestParam(name = "page", defaultValue = "0") page: Int,
        @RequestParam(name = "size", defaultValue = "10") size: Int,
    ): FeedbacksListResponse {
        log.info("feedbacks list workspaceId={} userId={} page={} size={}", workspaceId, user.id, page, size)
        return feedbacksService.listFeedbacksForMember(workspaceId, user.id, page, size)
    }

    @GetMapping("/analytics/overview")
    fun getOverviewAnalytics(
        @AuthenticationPrincipal user: AuthenticatedUser,
        @PathVariable workspaceId: UUID,
    ): FeedbackOverviewAnalyticsResponse {
        log.info("feedbacks overviewAnalytics workspaceId={} userId={}", workspaceId, user.id)
        return feedbacksService.getOverviewAnalyticsForMember(workspaceId, user.id)
    }

    @DeleteMapping("/{feedbackId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteFeedback(
        @AuthenticationPrincipal user: AuthenticatedUser,
        @PathVariable workspaceId: UUID,
        @PathVariable feedbackId: UUID,
    ) {
        log.info("feedbacks delete workspaceId={} feedbackId={} userId={}", workspaceId, feedbackId, user.id)
        feedbacksService.deleteFeedbackForMember(workspaceId, feedbackId, user.id)
    }
}
