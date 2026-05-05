package com.feedlytics.service.auth.repository

import com.feedlytics.service.auth.entity.EmailVerificationEntity
import org.springframework.data.jpa.repository.JpaRepository

interface EmailVerificationRepository: JpaRepository<EmailVerificationEntity, Long> {

    fun findByUserIdAndCodeAndIsUsedFalse(userId: Long, code: String): EmailVerificationEntity?
    fun findByUserIdAndIsUsedFalseAndExpiresAtAfter(userId: Long, expiresAt: java.time.Instant?): EmailVerificationEntity?
    fun deleteByUserId(userId: Long)
}
