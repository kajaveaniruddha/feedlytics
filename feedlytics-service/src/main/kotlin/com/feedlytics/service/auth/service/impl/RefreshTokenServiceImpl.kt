package com.feedlytics.service.auth.service.impl

import com.feedlytics.service.auth.entity.RefreshToken
import com.feedlytics.service.auth.repository.RefreshTokenRepository
import com.feedlytics.service.auth.service.RefreshTokenService
import com.feedlytics.service.auth.service.RotationResult
import com.feedlytics.service.common.exception.UnauthorizedException
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.security.MessageDigest
import java.security.SecureRandom
import java.time.Instant
import java.util.Base64
import java.util.UUID

@Service
class RefreshTokenServiceImpl(
    private val refreshTokenRepository: RefreshTokenRepository,
    @Value("\${jwt.refresh-token-expiry}") private val refreshTokenExpirySeconds: Long
) : RefreshTokenService {

    companion object {
        private const val TOKEN_BYTE_LENGTH = 32
        private val SECURE_RANDOM = SecureRandom()
        private val BASE64_URL_ENCODER = Base64.getUrlEncoder().withoutPadding()
    }

    @Transactional
    override fun issueNew(userId: Long, familyId: UUID?): String {
        val plaintext = generatePlaintextToken()
        val entity = RefreshToken(
            userId = userId,
            tokenHash = sha256Hex(plaintext),
            familyId = familyId ?: UUID.randomUUID(),
            expiresAt = Instant.now().plusSeconds(refreshTokenExpirySeconds)
        )
        refreshTokenRepository.save(entity)
        return plaintext
    }

    @Transactional
    override fun rotate(plaintextToken: String): RotationResult {
        val hash = sha256Hex(plaintextToken)
        val existing = refreshTokenRepository.findByTokenHash(hash)
            ?: throw UnauthorizedException("INVALID_REFRESH_TOKEN", "Invalid refresh token")

        if (existing.revokedAt != null) {
            // Token was already rotated/revoked. This is a reuse attempt - compromise suspected.
            refreshTokenRepository.revokeFamily(existing.familyId, Instant.now())
            throw UnauthorizedException("TOKEN_REUSE", "Refresh token reuse detected; all sessions revoked")
        }

        if (existing.expiresAt.isBefore(Instant.now())) {
            existing.revokedAt = Instant.now()
            refreshTokenRepository.save(existing)
            throw UnauthorizedException("REFRESH_TOKEN_EXPIRED", "Refresh token has expired")
        }

        val newPlaintext = generatePlaintextToken()
        val newEntity = RefreshToken(
            userId = existing.userId,
            tokenHash = sha256Hex(newPlaintext),
            familyId = existing.familyId,
            expiresAt = Instant.now().plusSeconds(refreshTokenExpirySeconds)
        )
        val saved = refreshTokenRepository.save(newEntity)

        existing.revokedAt = Instant.now()
        existing.replacedById = saved.id
        refreshTokenRepository.save(existing)

        return RotationResult(userId = existing.userId, newPlaintextToken = newPlaintext)
    }

    @Transactional
    override fun revoke(plaintextToken: String) {
        val hash = sha256Hex(plaintextToken)
        val existing = refreshTokenRepository.findByTokenHash(hash) ?: return
        if (existing.revokedAt == null) {
            existing.revokedAt = Instant.now()
            refreshTokenRepository.save(existing)
        }
    }

    @Transactional
    override fun revokeAllForUser(userId: Long) {
        refreshTokenRepository.revokeAllForUser(userId, Instant.now())
    }

    private fun generatePlaintextToken(): String {
        val bytes = ByteArray(TOKEN_BYTE_LENGTH)
        SECURE_RANDOM.nextBytes(bytes)
        return BASE64_URL_ENCODER.encodeToString(bytes)
    }

    private fun sha256Hex(input: String): String {
        val digest = MessageDigest.getInstance("SHA-256").digest(input.toByteArray(Charsets.UTF_8))
        return digest.joinToString("") { "%02x".format(it) }
    }
}
