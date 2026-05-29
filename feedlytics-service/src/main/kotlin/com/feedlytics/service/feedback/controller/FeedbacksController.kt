package com.feedlytics.service.feedback.controller

import com.feedlytics.service.common.security.AuthenticatedUser
import com.feedlytics.service.feedback.dto.response.FeedbackOverviewAnalyticsResponse
import com.feedlytics.service.feedback.dto.response.FeedbacksListResponse
import com.feedlytics.service.feedback.service.FeedbacksService
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

    @GetMapping
    fun listFeedbacks(
        @AuthenticationPrincipal user: AuthenticatedUser,
        @PathVariable workspaceId: UUID,
        @RequestParam(name = "page", defaultValue = "0") page: Int,
        @RequestParam(name = "size", defaultValue = "10") size: Int,
    ): FeedbacksListResponse {
        return feedbacksService.listFeedbacksForMember(workspaceId, user.id, page, size)
    }

    @GetMapping("/analytics/overview")
    fun getOverviewAnalytics(
        @AuthenticationPrincipal user: AuthenticatedUser,
        @PathVariable workspaceId: UUID,
    ): FeedbackOverviewAnalyticsResponse {
        return feedbacksService.getOverviewAnalyticsForMember(workspaceId, user.id)
    }

    @DeleteMapping("/{feedbackId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteFeedback(
        @AuthenticationPrincipal user: AuthenticatedUser,
        @PathVariable workspaceId: UUID,
        @PathVariable feedbackId: UUID,
    ) {
        feedbacksService.deleteFeedbackForMember(workspaceId, feedbackId, user.id)
    }
}
