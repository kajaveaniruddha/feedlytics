package com.feedlytics.service.auth.service

import java.util.UUID

interface RefreshTokenService {

    fun issueNew(userId: Long, familyId: UUID? = null): String

    fun rotate(plaintextToken: String): RotationResult

    fun revoke(plaintextToken: String)

    fun revokeAllForUser(userId: Long)
}

data class RotationResult(
    val userId: Long,
    val newPlaintextToken: String
)
