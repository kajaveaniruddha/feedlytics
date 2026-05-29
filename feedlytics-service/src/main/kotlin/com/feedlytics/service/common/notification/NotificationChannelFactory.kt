package com.feedlytics.service.common.notification

import org.springframework.stereotype.Component

@Component
class NotificationChannelFactory(
    channels: List<NotificationChannel>,
) {
    private val channelByType: Map<NotificationChannelType, NotificationChannel> =
        channels.associateBy { it.channelType }

    fun getChannel(type: NotificationChannelType): NotificationChannel =
        channelByType[type]
            ?: throw IllegalArgumentException("Notification channel not configured: $type")
}
