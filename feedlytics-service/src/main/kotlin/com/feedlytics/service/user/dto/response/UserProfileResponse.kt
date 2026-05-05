package com.feedlytics.service.user.dto.response

import java.time.Instant
import java.util.UUID

data class UserProfileResponse(
    val success: Boolean = true,
    val user: UserProfileData
)

data class UserProfileData(
    val publicId: UUID,
    val email: String,
    val name: String,
    val avatarUrl: String?,
    val isEmailVerified: Boolean,
    val createdAt: Instant,
    val updatedAt: Instant
)
