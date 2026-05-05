package com.feedlytics.service.common.entity

import jakarta.persistence.*
import java.time.Instant

@MappedSuperclass
abstract class BaseEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    open val id: Long = 0,

    @Column(name = "created_at", nullable = false, updatable = false)
    open val createdAt: Instant = Instant.now(),

    @Column(name = "updated_at", nullable = false)
    open var updatedAt: Instant = Instant.now()
)
