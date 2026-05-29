package com.feedlytics.service.workspace.usage

data class LimitApproachingEvent(
    val workspaceId: Long,
    val limitType: String,
    val currentUsage: Int,
    val limit: Int,
    val percentageUsed: Double,
)
