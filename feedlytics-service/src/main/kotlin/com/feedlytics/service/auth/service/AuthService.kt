package com.feedlytics.service.auth.service

import com.feedlytics.service.auth.dto.request.LoginRequest
import com.feedlytics.service.auth.dto.request.RegenerateEmailVerificationCodeRequest
import com.feedlytics.service.auth.dto.request.RegisterRequest
import com.feedlytics.service.auth.dto.request.VerifyEmailRequest
import com.feedlytics.service.auth.dto.response.AuthOutcome
import com.feedlytics.service.auth.dto.response.RegisterResult

interface AuthService {
    fun register(request: RegisterRequest): RegisterResult
    fun login(request: LoginRequest): AuthOutcome
    fun verifyEmail(request: VerifyEmailRequest): Boolean
    fun regenerateEmailVerificationCode(request: RegenerateEmailVerificationCodeRequest)

    /**
     * Rotates the refresh token. The plaintext refresh token comes from the HttpOnly
     * cookie (extracted in the controller) — it is no longer accepted in the JSON body.
     */
    fun refresh(refreshToken: String): AuthOutcome

    /**
     * Revokes a refresh token. The plaintext token comes from the HttpOnly cookie.
     * No-ops gracefully if the cookie is absent or already revoked.
     */
    fun logout(refreshToken: String?)
}
