package com.feedlytics.service.auth.entity

import com.feedlytics.service.common.entity.BaseEntity
import jakarta.persistence.*
import java.time.Instant

@Entity
@Table(name = "email_verifications")
class EmailVerificationEntity(
    @Column(name = "user_id", nullable = false)
    val userId: Long,

    @Column(nullable = false, length = 6)
    var code: String,

    @Column(name = "expires_at", nullable = false)
    var expiresAt: Instant,

    @Column(name = "is_used", nullable = false)
    var isUsed: Boolean = false

) : BaseEntity()
