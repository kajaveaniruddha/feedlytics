package com.feedlytics.service.common.config

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "google.oauth")
data class GoogleAuthProperties(
    val clientId: String = ""
)
