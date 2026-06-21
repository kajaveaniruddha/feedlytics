package com.feedlytics.service.notification.service

import com.feedlytics.service.notification.entity.NotificationDeliveryStatusEnum
import com.feedlytics.service.notification.repository.InAppNotificationRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Propagation
import org.springframework.transaction.annotation.Transactional

@Service
class InAppNotificationDeliveryService(
    private val repository: InAppNotificationRepository,
) {

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    fun markSent(id: Long) {
        val row = repository.findById(id).orElse(null) ?: return
        row.deliveryStatus = NotificationDeliveryStatusEnum.SENT
        row.deliveryError = null
        repository.save(row)
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    fun markFailed(id: Long, error: String) {
        val row = repository.findById(id).orElse(null) ?: return
        row.deliveryStatus = NotificationDeliveryStatusEnum.FAILED
        row.deliveryError = error.take(2000)
        repository.save(row)
    }
}
