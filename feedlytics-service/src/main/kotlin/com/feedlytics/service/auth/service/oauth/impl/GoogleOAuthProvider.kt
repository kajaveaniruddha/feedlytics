package com.feedlytics.service.auth.service.oauth.impl

import com.feedlytics.service.auth.service.oauth.OAuthProvider
import com.feedlytics.service.auth.service.oauth.OAuthUserInfo
import com.feedlytics.service.common.config.GoogleAuthProperties
import com.feedlytics.service.common.entity.enums.AuthProviders

import com.feedlytics.service.common.exception.UnauthorizedException
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier
import com.google.api.client.http.javanet.NetHttpTransport
import com.google.api.client.json.gson.GsonFactory
import org.springframework.stereotype.Component
import java.util.Collections

@Component
class GoogleOAuthProvider(
    private val googleAuthProperties: GoogleAuthProperties
) : OAuthProvider {

    override val providerName: AuthProviders = AuthProviders.GOOGLE

    private val verifier: GoogleIdTokenVerifier by lazy {
        GoogleIdTokenVerifier.Builder(NetHttpTransport(), GsonFactory.getDefaultInstance())
            .setAudience(Collections.singletonList(googleAuthProperties.clientId))
            .build()
    }

    override fun verifyToken(idToken: String): OAuthUserInfo {
        val payload = verifyIdToken(idToken)

        val providerUserId = payload.subject
        val email = payload.email
            ?: throw UnauthorizedException("INVALID_GOOGLE_TOKEN", "Google token missing email")
        val emailVerified = payload.emailVerified ?: false
        val name = (payload["name"] as? String) ?: email.substringBefore('@')
        val picture = payload["picture"] as? String

        if (!emailVerified) {
            throw UnauthorizedException("EMAIL_NOT_VERIFIED", "Google email is not verified")
        }

        return OAuthUserInfo(
            providerUserId = providerUserId,
            email = email,
            name = name,
            avatarUrl = picture,
            isEmailVerified = emailVerified
        )
    }

    private fun verifyIdToken(idToken: String): GoogleIdToken.Payload {
        val verified = try {
            verifier.verify(idToken)
        } catch (e: Exception) {
            throw UnauthorizedException("INVALID_GOOGLE_TOKEN", "Failed to verify Google ID token")
        }
        return verified?.payload
            ?: throw UnauthorizedException("INVALID_GOOGLE_TOKEN", "Invalid Google ID token")
    }
}
