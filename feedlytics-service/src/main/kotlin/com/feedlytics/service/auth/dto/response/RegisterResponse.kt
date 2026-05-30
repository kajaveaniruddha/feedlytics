package com.feedlytics.service.auth.dto.response

import java.util.UUID

sealed class RegisterResult {
    data class RequiresVerification(
        val success: Boolean = true,
        val message: String = "Verification email sent.",
        val userPublicId: UUID
    ) : RegisterResult()

    /**
     * Carries [AuthOutcome] (not just [AuthResponse]) so the controller can pull
     * the refresh token out and place it into the HttpOnly cookie.
     */
    data class AutoVerified(
        val outcome: AuthOutcome
    ) : RegisterResult()
}

data class RegisterResponse(
    val success: Boolean = true,
    val message: String = "Verification email sent.",
    val userPublicId: UUID
)
