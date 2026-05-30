package com.feedlytics.service.auth.dto.request

data class VerifyEmailRequest(
    val email: String,
    val code: String
)
