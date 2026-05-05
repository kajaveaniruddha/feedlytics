package com.feedlytics.service.auth.service.oauth

import com.feedlytics.service.common.entity.enums.AuthProviders

interface OAuthProvider {
    val providerName: AuthProviders

    fun verifyToken(idToken: String): OAuthUserInfo
}

data class OAuthUserInfo(
    val providerUserId: String,
    val email: String,
    val name: String,
    val avatarUrl: String?,
    val isEmailVerified: Boolean
)
