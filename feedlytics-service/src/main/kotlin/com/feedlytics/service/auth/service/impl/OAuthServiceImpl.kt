package com.feedlytics.service.auth.service.impl

import com.feedlytics.service.auth.dto.response.AuthOutcome
import com.feedlytics.service.auth.dto.response.AuthResponse
import com.feedlytics.service.auth.entity.LinkedAccount
import com.feedlytics.service.auth.repository.LinkedAccountRepository
import com.feedlytics.service.auth.service.OAuthService
import com.feedlytics.service.auth.service.RefreshTokenService
import com.feedlytics.service.auth.service.oauth.OAuthProviderFactory
import com.feedlytics.service.auth.service.oauth.OAuthUserInfo
import com.feedlytics.service.common.entity.User
import com.feedlytics.service.common.entity.enums.AuthProviders
import com.feedlytics.service.common.exception.UnauthorizedException
import com.feedlytics.service.common.repository.UserRepository
import com.feedlytics.service.common.security.JwtService
import com.feedlytics.service.workspace.service.InviteService
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class OAuthServiceImpl(
    private val providerFactory: OAuthProviderFactory,
    private val userRepository: UserRepository,
    private val linkedAccountRepository: LinkedAccountRepository,
    private val refreshTokenService: RefreshTokenService,
    private val jwtService: JwtService,
    private val inviteService: InviteService
) : OAuthService {

    private val logger = LoggerFactory.getLogger(OAuthServiceImpl::class.java)

    @Transactional
    override fun authenticate(provider: String, idToken: String, inviteToken: String?): AuthOutcome {
        logger.info("OAuth authentication attempt with provider: $provider")

        val oauthProvider = providerFactory.getProvider(provider)
        val userInfo = oauthProvider.verifyToken(idToken)

        if (inviteToken != null) {
            inviteService.validateInviteToken(inviteToken, userInfo.email)
        }

        val user = findOrCreateUser(oauthProvider.providerName, userInfo)

        val joinedWorkspace = inviteToken?.let { token ->
            inviteService.tryAcceptInviteAfterAuth(token, user.id, user.email)
        }

        val accessToken = jwtService.generateAccessToken(user)
        val refreshToken = refreshTokenService.issueNew(user.id)

        logger.info("OAuth authentication successful for user: ${user.email} via $provider")

        val response = AuthResponse.from(
            user = user,
            accessToken = accessToken,
            expiresIn = jwtService.getAccessTokenExpirySeconds(),
            acceptResult = joinedWorkspace
        )
        return AuthOutcome(response = response, refreshToken = refreshToken)
    }

    private fun findOrCreateUser(provider: AuthProviders, info: OAuthUserInfo): User {
        val existingLink = linkedAccountRepository.findByProviderAndProviderUserId(provider, info.providerUserId)
        if (existingLink != null) {
            logger.debug("Found existing linked account for provider: $provider")
            return userRepository.findById(existingLink.userId).orElseThrow {
                UnauthorizedException("USER_NOT_FOUND", "Linked user not found")
            }
        }

        val existingByEmail = userRepository.findByEmail(info.email)
        if (existingByEmail != null) {
            logger.info("Linking $provider account to existing user: ${info.email}")
            linkedAccountRepository.save(
                LinkedAccount(
                    userId = existingByEmail.id,
                    provider = provider,
                    providerUserId = info.providerUserId
                )
            )
            if (!existingByEmail.isEmailVerified && info.isEmailVerified) {
                existingByEmail.isEmailVerified = true
                userRepository.save(existingByEmail)
            }
            return existingByEmail
        }

        logger.info("Creating new user from $provider: ${info.email}")
        val newUser = User(
            email = info.email,
            passwordHash = null,
            name = info.name,
            avatarUrl = info.avatarUrl,
            isEmailVerified = info.isEmailVerified
        )
        val savedUser = userRepository.save(newUser)

        linkedAccountRepository.save(
            LinkedAccount(
                userId = savedUser.id,
                provider = provider,
                providerUserId = info.providerUserId
            )
        )

        return savedUser
    }
}
