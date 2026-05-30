package com.feedlytics.service.common.security

import java.util.UUID

data class AuthenticatedUser(
    val id: Long,
    val publicId: UUID,
    val email: String,
    val name: String
)
