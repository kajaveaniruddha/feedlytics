package com.feedlytics.service.auth.util

import com.feedlytics.service.common.config.CookieProperties
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.ResponseCookie
import org.springframework.stereotype.Component
import java.time.Duration

/**
 * Centralized builder for the refresh-token cookie.
 *
 * Plan B places the refresh token in an HttpOnly cookie so it cannot be read by
 * JavaScript (XSS-safe). The access token continues to flow in the response body
 * and is held in memory by the SPA.
 */
@Component
class RefreshCookieFactory(
    private val cookieProperties: CookieProperties,
    @Value("\${jwt.refresh-token-expiry}") private val refreshTokenExpirySeconds: Long
) {

    fun buildSetCookie(refreshToken: String): ResponseCookie {
        return baseBuilder(refreshToken)
            .maxAge(Duration.ofSeconds(refreshTokenExpirySeconds))
            .build()
    }

    /**
     * Cookie with Max-Age=0 and an empty value tells the browser to delete the
     * stored cookie. All other attributes (path, domain, sameSite, secure) must
     * match the original Set-Cookie or the browser will refuse to remove it.
     */
    fun buildClearCookie(): ResponseCookie {
        return baseBuilder("")
            .maxAge(Duration.ZERO)
            .build()
    }

    fun cookieName(): String = cookieProperties.refreshName

    private fun baseBuilder(value: String): ResponseCookie.ResponseCookieBuilder {
        val builder = ResponseCookie.from(cookieProperties.refreshName, value)
            .httpOnly(cookieProperties.httpOnly)
            .secure(cookieProperties.secure)
            .path(cookieProperties.path)
            .sameSite(cookieProperties.sameSite)
        if (cookieProperties.domain.isNotBlank()) {
            builder.domain(cookieProperties.domain)
        }
        return builder
    }
}
