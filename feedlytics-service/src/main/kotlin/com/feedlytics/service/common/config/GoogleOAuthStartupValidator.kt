package com.feedlytics.service.common.config

import org.slf4j.LoggerFactory
import org.springframework.boot.context.event.ApplicationReadyEvent
import org.springframework.context.event.EventListener
import org.springframework.stereotype.Component

@Component
class GoogleOAuthStartupValidator(
    private val googleAuthProperties: GoogleAuthProperties
) {
    private val logger = LoggerFactory.getLogger(GoogleOAuthStartupValidator::class.java)

    @EventListener(ApplicationReadyEvent::class)
    fun warnWhenUnconfigured() {
        if (googleAuthProperties.clientId.isBlank()) {
            logger.warn(
                "GOOGLE_OAUTH_CLIENT_ID is not set — Google sign-in will fail ID token verification"
            )
        }
    }
}
