package com.feedlytics.service.billing.repository

import com.feedlytics.service.billing.entity.ProcessedStripeEventEntity
import org.springframework.data.jpa.repository.JpaRepository

interface ProcessedStripeEventRepository : JpaRepository<ProcessedStripeEventEntity, Long> {

    fun existsByStripeEventId(stripeEventId: String): Boolean
}
