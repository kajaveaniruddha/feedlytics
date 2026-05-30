package com.feedlytics.service.common.entity

import jakarta.persistence.*
import java.util.UUID

@MappedSuperclass
abstract class BasePublicEntity(
    @Column(name = "public_id", nullable = false, unique = true, updatable = false)
    open val publicId: UUID = UUID.randomUUID()
) : BaseEntity()
