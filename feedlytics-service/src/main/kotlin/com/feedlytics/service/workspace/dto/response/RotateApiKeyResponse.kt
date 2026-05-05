package com.feedlytics.service.workspace.dto.response

data class RotateApiKeyResponse(
    val success: Boolean = true,
    val apiKey: String,
)
