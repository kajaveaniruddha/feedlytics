package com.feedlytics.service.common.notification

import org.springframework.stereotype.Service

@Service
class NotificationService(
    private val notificationChannelFactory: NotificationChannelFactory,
) {
    fun notify(channelType: NotificationChannelType, notification: Notification): NotificationResult {
        return notificationChannelFactory.getChannel(channelType).send(notification)
    }
}
