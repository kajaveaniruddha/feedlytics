package com.feedlytics.service.common.notification

sealed class NotificationResult {
    data object Accepted : NotificationResult()

    data class Rejected(val reason: String) : NotificationResult()
}
