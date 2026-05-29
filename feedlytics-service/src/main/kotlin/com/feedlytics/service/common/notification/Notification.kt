package com.feedlytics.service.common.notification

import com.feedlytics.service.feedback.dto.request.SendFeedbackRequest
import com.feedlytics.service.feedback.entity.FeedbacksEntity

sealed class Notification {
    data class EmailVerification(
        val email: String,
        val username: String,
        val verifyCode: String,
        val expiryAtEpochMs: Long,
    ) : Notification()

    data class WorkspaceInvitation(
        val email: String,
        val workspaceName: String,
        val inviterName: String,
        val role: String,
        val inviteToken: String,
        val expiresAtEpochMs: Long,
    ) : Notification()

    data class FeedbackAnalysisEnqueue(
        val savedFeedback: FeedbacksEntity,
        val request: SendFeedbackRequest,
        val categoryNames: List<String>,
    ) : Notification()
}
