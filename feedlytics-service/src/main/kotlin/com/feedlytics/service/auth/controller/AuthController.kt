package com.feedlytics.service.auth.controller

import com.feedlytics.service.auth.dto.request.LoginRequest
import com.feedlytics.service.auth.dto.request.OAuthSignInRequest
import com.feedlytics.service.auth.dto.request.RegenerateEmailVerificationCodeRequest
import com.feedlytics.service.auth.dto.request.RegisterRequest
import com.feedlytics.service.auth.dto.request.VerifyEmailRequest
import com.feedlytics.service.auth.dto.response.AuthOutcome
import com.feedlytics.service.auth.dto.response.AuthResponse
import com.feedlytics.service.auth.dto.response.RegisterResponse
import com.feedlytics.service.auth.dto.response.RegisterResult
import com.feedlytics.service.auth.service.AuthService
import com.feedlytics.service.auth.service.OAuthService
import com.feedlytics.service.auth.util.RefreshCookieFactory
import jakarta.validation.Valid
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CookieValue
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/auth")
class AuthController(
    private val authService: AuthService,
    private val oauthService: OAuthService,
    private val refreshCookieFactory: RefreshCookieFactory
) {

    @PostMapping("/register")
    fun register(@Valid @RequestBody request: RegisterRequest): ResponseEntity<*> {
        return when (val result = authService.register(request)) {
            is RegisterResult.RequiresVerification -> {
                ResponseEntity.status(HttpStatus.CREATED).body(
                    RegisterResponse(
                        userPublicId = result.userPublicId,
                        message = result.message
                    )
                )
            }
            is RegisterResult.AutoVerified -> {
                respondWithRefreshCookie(result.outcome, HttpStatus.CREATED)
            }
        }
    }

    @PostMapping("/login")
    fun login(@Valid @RequestBody request: LoginRequest): ResponseEntity<AuthResponse> {
        val outcome = authService.login(request)
        return respondWithRefreshCookie(outcome, HttpStatus.OK)
    }

    @PostMapping("/verify-email")
    fun verifyEmail(@Valid @RequestBody request: VerifyEmailRequest): ResponseEntity<Map<String, Any>> {
        authService.verifyEmail(request)
        return ResponseEntity.ok(mapOf("success" to true, "message" to "Email verified successfully"))
    }

    @PostMapping("/regenerate-email-verification-code")
    fun regenerateEmailVerificationCode(
        @Valid @RequestBody request: RegenerateEmailVerificationCodeRequest
    ): ResponseEntity<Map<String, Any>> {
        authService.regenerateEmailVerificationCode(request)
        return ResponseEntity.ok(mapOf("success" to true, "message" to "Verification code sent"))
    }

    @PostMapping("/oauth/{provider}")
    fun signInWithOAuth(
        @PathVariable provider: String,
        @Valid @RequestBody request: OAuthSignInRequest
    ): ResponseEntity<AuthResponse> {
        val outcome = oauthService.authenticate(provider, request.idToken, request.inviteToken)
        return respondWithRefreshCookie(outcome, HttpStatus.OK)
    }

    /**
     * Refresh now relies exclusively on the HttpOnly cookie. The previous JSON
     * body field is gone so a stolen access token cannot be paired with a
     * refresh token sitting next to it in the same payload.
     */
    @PostMapping("/refresh")
    fun refresh(
        @CookieValue(name = "\${app.cookie.refresh-name}", required = false) refreshToken: String?
    ): ResponseEntity<AuthResponse> {
        if (refreshToken.isNullOrBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()
        }
        val outcome = authService.refresh(refreshToken)
        return respondWithRefreshCookie(outcome, HttpStatus.OK)
    }

    @PostMapping("/logout")
    fun logout(
        @CookieValue(name = "\${app.cookie.refresh-name}", required = false) refreshToken: String?
    ): ResponseEntity<Map<String, Any>> {
        authService.logout(refreshToken)
        // Always clear the cookie regardless of whether one was sent so logout
        // is idempotent and won't leave a stale cookie on the client.
        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, refreshCookieFactory.buildClearCookie().toString())
            .body(mapOf("success" to true))
    }

    private fun respondWithRefreshCookie(
        outcome: AuthOutcome,
        status: HttpStatus
    ): ResponseEntity<AuthResponse> {
        val cookie = refreshCookieFactory.buildSetCookie(outcome.refreshToken)
        return ResponseEntity.status(status)
            .header(HttpHeaders.SET_COOKIE, cookie.toString())
            .body(outcome.response)
    }
}
