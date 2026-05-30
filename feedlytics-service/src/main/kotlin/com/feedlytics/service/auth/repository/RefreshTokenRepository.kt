package com.feedlytics.service.auth.repository

import com.feedlytics.service.auth.entity.RefreshToken
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.time.Instant
import java.util.UUID

interface RefreshTokenRepository : JpaRepository<RefreshToken, Long> {

    fun findByTokenHash(tokenHash: String): RefreshToken?

    @Modifying
    @Query(
        """
        UPDATE RefreshToken rt
           SET rt.revokedAt = :revokedAt
         WHERE rt.familyId = :familyId
           AND rt.revokedAt IS NULL
        """
    )
    fun revokeFamily(@Param("familyId") familyId: UUID, @Param("revokedAt") revokedAt: Instant): Int

    @Modifying
    @Query(
        """
        UPDATE RefreshToken rt
           SET rt.revokedAt = :revokedAt
         WHERE rt.userId = :userId
           AND rt.revokedAt IS NULL
        """
    )
    fun revokeAllForUser(@Param("userId") userId: Long, @Param("revokedAt") revokedAt: Instant): Int
}
