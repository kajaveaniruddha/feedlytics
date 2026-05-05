package com.feedlytics.service.workspace.dto

data class UsageInfoDto(
    val feedbackCount: Int,
    val apiCalls: Int,
    val campaignCount: Int,
    val periodStart: java.time.Instant
)
