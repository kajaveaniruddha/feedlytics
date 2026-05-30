package com.feedlytics.service.feedback.auth

import com.feedlytics.service.workspace.entity.WorkspacesEntity

data class FeedbackAuthRequest(
    val workspace: WorkspacesEntity,
    val apiKey: String?,
    val widgetSecret: String?,
    val origin: String?,
    val bearerToken: String? = null,
    val ipAddress: String? = null,
)
