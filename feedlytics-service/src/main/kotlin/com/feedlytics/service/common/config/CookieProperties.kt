package com.feedlytics.service.common.config

import org.springframework.boot.context.properties.ConfigurationProperties

/**
 * Refresh-token cookie attributes.
 *
 * Plan B (refresh in HttpOnly cookie, access in memory) requires careful cookie scoping:
 *  - [path] limits the cookie to /api/v1/auth so it isn't sent on unrelated endpoints.
 *  - [secure] must be true in any non-localhost prod-like environment.
 *  - [sameSite] should be Lax for first-party setups; use None+Secure only when the
 *    frontend lives on a different registrable domain.
 *  - [domain] is left blank in dev so the browser scopes to the host (e.g. localhost).
 */
@ConfigurationProperties(prefix = "app.cookie")
data class CookieProperties(
    var refreshName: String = "refreshToken",
    var path: String = "/api/v1/auth",
    var secure: Boolean = false,
    var httpOnly: Boolean = true,
    var sameSite: String = "Lax",
    var domain: String = ""
)
