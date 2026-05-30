package com.feedlytics.service.billing.entity

import jakarta.persistence.*
import java.time.Instant

@Entity
@Table(name = "processed_stripe_events")
class ProcessedStripeEventEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(name = "stripe_event_id", nullable = false, unique = true)
    val stripeEventId: String,

    @Column(name = "event_type", nullable = false, length = 100)
    val eventType: String,

    @Column(name = "processed_at", nullable = false, updatable = false)
    val processedAt: Instant = Instant.now(),
)
