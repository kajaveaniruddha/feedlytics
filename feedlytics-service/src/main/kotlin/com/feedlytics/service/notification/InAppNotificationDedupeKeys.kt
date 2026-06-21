package com.feedlytics.service.notification

object InAppNotificationDedupeKeys {
    fun invitePending(inviteId: java.util.UUID): String = "invite:$inviteId:pending"
}
