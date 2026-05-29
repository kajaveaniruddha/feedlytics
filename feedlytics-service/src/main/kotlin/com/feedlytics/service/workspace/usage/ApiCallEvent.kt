package com.feedlytics.service.workspace.usage

import java.time.Instant

data class ApiCallEvent(
    val workspaceId: Long,
    val currentCount: Int,
    val limit: Int,
    val timestamp: Instant,
)
