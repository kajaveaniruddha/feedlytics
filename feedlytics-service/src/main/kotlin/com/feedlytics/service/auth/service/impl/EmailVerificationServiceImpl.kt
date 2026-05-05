package com.feedlytics.service.auth.service.impl

import com.feedlytics.service.auth.entity.EmailVerificationEntity
import com.feedlytics.service.auth.repository.EmailVerificationRepository
import com.feedlytics.service.auth.service.EmailVerificationService
import com.feedlytics.service.common.entity.User
import com.feedlytics.service.common.exception.BadRequestException
import com.feedlytics.service.common.repository.UserRepository
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service
import java.time.Instant
import kotlin.random.Random

@Service
class EmailVerificationServiceImpl(
    private val emailVerificationRepository: EmailVerificationRepository,
    private val userRepository: UserRepository) :
    EmailVerificationService {
    companion object {
        private const val CODE_EXPIRY_MINUTES = 15L
    }

    @Transactional
    override fun createAndSendVerificationEmail(user: User) {
        // Delete any existing unused verifications
        emailVerificationRepository.deleteByUserId(user.id)
        // Generate 6-digit code
        val code = generateCode()
        val verification = EmailVerificationEntity(
            userId = user.id,
            code = code,
            expiresAt = Instant.now().plusSeconds(CODE_EXPIRY_MINUTES * 60)
        )
        emailVerificationRepository.save(verification)
        // TODO: Send email with code (implement email service later)
        println("Verification code for ${user.email}: $code")

    }

    @Transactional
    override fun verifyEmail(userId: Long, code: String): Boolean {
        val verification = emailVerificationRepository
            .findByUserIdAndCodeAndIsUsedFalse(userId, code)
            ?: throw BadRequestException("INVALID_CODE", "Invalid or expired verification code")
        if (verification.expiresAt.isBefore(Instant.now())) {
            throw BadRequestException("CODE_EXPIRED", "Verification code has expired")
        }

        // Mark code as used
        verification.isUsed = true
        emailVerificationRepository.save(verification)

        // Mark user email as verified
        val user = userRepository.findById(userId).orElseThrow {
            BadRequestException("USER_NOT_FOUND", "User not found")
        }
        user.isEmailVerified = true
        userRepository.save(user)
        return true
    }

    private fun generateCode(): String {
        return (100000 + Random.nextInt(900000)).toString()
    }

}
