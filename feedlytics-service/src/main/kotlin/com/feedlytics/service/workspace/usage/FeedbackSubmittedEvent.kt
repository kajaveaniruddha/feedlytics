package com.feedlytics.service.workspace.usage

import java.time.Instant

data class FeedbackSubmittedEvent(
    val workspaceId: Long,
    val feedbackId: Long,
    val currentCount: Int,
    val limit: Int,
    val timestamp: Instant,
)
