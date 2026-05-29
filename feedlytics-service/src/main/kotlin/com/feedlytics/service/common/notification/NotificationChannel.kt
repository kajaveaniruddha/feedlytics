package com.feedlytics.service.common.notification

interface NotificationChannel {
    val channelType: NotificationChannelType

    fun send(notification: Notification): NotificationResult
}
