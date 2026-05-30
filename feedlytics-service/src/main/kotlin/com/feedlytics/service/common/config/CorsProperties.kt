package com.feedlytics.service.common.config

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "app.cors")
data class CorsProperties(
    var allowedOrigins: List<String> = listOf("http://localhost:3000"),
) {
    /**
     * Docker/.env often supplies a single comma-separated entry; Spring may bind it
     * as one list element. Normalize to explicit origins for credentialed SPA CORS.
     */
    fun resolvedOrigins(): List<String> =
        allowedOrigins
            .flatMap { entry -> entry.split(",") }
            .map { it.trim().trimEnd('/') }
            .filter { it.isNotEmpty() }
            .distinct()
}
