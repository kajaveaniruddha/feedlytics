package com.feedlytics.service.workspace.dto.response

data class WorkspaceIntegrationStatusResponse(
    val success: Boolean = true,
    val hasApiKey: Boolean,
    val hasWidgetSecret: Boolean,
    val hasWidgetOrigins: Boolean,
    val widgetOrigins: List<String>,
)
