package com.feedlytics.service.auth.dto.request

import jakarta.validation.constraints.NotBlank

data class OAuthSignInRequest(
    @field:NotBlank(message = "idToken is required")
    val idToken: String,

    val inviteToken: String? = null
)
