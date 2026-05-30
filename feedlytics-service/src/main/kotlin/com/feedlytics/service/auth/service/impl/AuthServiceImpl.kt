package com.feedlytics.service.auth.service.impl

import com.feedlytics.service.auth.dto.request.LoginRequest
import com.feedlytics.service.auth.dto.request.RegenerateEmailVerificationCodeRequest
import com.feedlytics.service.auth.dto.request.RegisterRequest
import com.feedlytics.service.auth.dto.request.VerifyEmailRequest
import com.feedlytics.service.auth.dto.response.AuthOutcome
import com.feedlytics.service.auth.dto.response.AuthResponse
import com.feedlytics.service.auth.dto.response.JoinedWorkspaceInfo
import com.feedlytics.service.auth.dto.response.RegisterResult
import com.feedlytics.service.auth.service.AuthService
import com.feedlytics.service.auth.service.EmailVerificationService
import com.feedlytics.service.auth.service.RefreshTokenService
import com.feedlytics.service.common.entity.User
import com.feedlytics.service.common.exception.BadRequestException
import com.feedlytics.service.common.exception.ConflictException
import com.feedlytics.service.common.exception.ForbiddenException
import com.feedlytics.service.common.exception.UnauthorizedException
import com.feedlytics.service.common.repository.UserRepository
import com.feedlytics.service.common.security.JwtService
import com.feedlytics.service.workspace.dto.response.AcceptInviteResult
import com.feedlytics.service.workspace.service.InviteService
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class AuthServiceImpl(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtService: JwtService,
    private val emailVerificationService: EmailVerificationService,
    private val refreshTokenService: RefreshTokenService,
    private val inviteService: InviteService
) : AuthService {

    @Transactional
    override fun register(request: RegisterRequest): RegisterResult {
        if (userRepository.existsByEmail(request.email)) {
            throw ConflictException("EMAIL_EXISTS", "Email already registered")
        }

        // Validate invite token if provided (throws proper error on mismatch)
        val validatedInviteToken = request.inviteToken?.also { token ->
            inviteService.validateInviteToken(token, request.email)
        }

        val user = User(
            email = request.email,
            passwordHash = passwordEncoder.encode(request.password),
            name = request.name,
            isEmailVerified = validatedInviteToken != null
        )
        val savedUser = userRepository.save(user)

        return if (validatedInviteToken != null) {
            val joinedWorkspace = inviteService.tryAcceptInviteAfterAuth(
                validatedInviteToken, savedUser.id, savedUser.email
            )
            RegisterResult.AutoVerified(
                outcome = buildAuthOutcome(savedUser, joinedWorkspace)
            )
        } else {
            emailVerificationService.createAndSendVerificationEmail(savedUser)
            RegisterResult.RequiresVerification(userPublicId = savedUser.publicId)
        }
    }

    @Transactional
    override fun login(request: LoginRequest): AuthOutcome {
        val user = userRepository.findByEmail(request.email)
            ?: throw UnauthorizedException("INVALID_CREDENTIALS", "Invalid email or password")

        if (user.passwordHash == null || !passwordEncoder.matches(request.password, user.passwordHash)) {
            throw UnauthorizedException("INVALID_CREDENTIALS", "Invalid email or password")
        }

        if (!user.isEmailVerified) {
            throw ForbiddenException("EMAIL_NOT_VERIFIED", "Please verify your email first")
        }

        // Validate and auto-accept invite if token provided
        val joinedWorkspace = request.inviteToken?.let { token ->
            inviteService.validateInviteToken(token, user.email)
            inviteService.tryAcceptInviteAfterAuth(token, user.id, user.email)
        }

        return buildAuthOutcome(user, joinedWorkspace)
    }

    @Transactional
    override fun verifyEmail(request: VerifyEmailRequest): Boolean {
        val user = userRepository.findByEmail(request.email)
            ?: throw BadRequestException("USER_NOT_FOUND", "User not found")

        return emailVerificationService.verifyEmail(user.id, request.code)
    }

    @Transactional
    override fun regenerateEmailVerificationCode(request: RegenerateEmailVerificationCodeRequest) {
        val user = userRepository.findByEmail(request.email)
            ?: throw BadRequestException("USER_NOT_FOUND", "User not found")

        if (user.isEmailVerified) {
            throw BadRequestException("ALREADY_VERIFIED", "Email is already verified")
        }

        emailVerificationService.createAndSendVerificationEmail(user)
    }

    @Transactional
    override fun refresh(refreshToken: String): AuthOutcome {
        val rotation = refreshTokenService.rotate(refreshToken)
        val user = userRepository.findById(rotation.userId).orElseThrow {
            UnauthorizedException("USER_NOT_FOUND", "User not found")
        }
        val accessToken = jwtService.generateAccessToken(user)

        val response = AuthResponse.from(
            user = user,
            accessToken = accessToken,
            expiresIn = jwtService.getAccessTokenExpirySeconds()
        )
        return AuthOutcome(response = response, refreshToken = rotation.newPlaintextToken)
    }

    @Transactional
    override fun logout(refreshToken: String?) {
        // No cookie present is treated as a no-op so logout is idempotent.
        if (refreshToken.isNullOrBlank()) return
        refreshTokenService.revoke(refreshToken)
    }

    private fun buildAuthOutcome(
        user: User,
        joinedWorkspace: AcceptInviteResult? = null
    ): AuthOutcome {
        val accessToken = jwtService.generateAccessToken(user)
        val refreshToken = refreshTokenService.issueNew(user.id)

        val joinedWorkspaceInfo = joinedWorkspace?.let {
            JoinedWorkspaceInfo(
                workspacePublicId = it.workspacePublicId,
                workspaceName = it.workspaceName,
                role = it.member.role.name
            )
        }

        val response = AuthResponse.from(
            user = user,
            accessToken = accessToken,
            expiresIn = jwtService.getAccessTokenExpirySeconds(),
            joinedWorkspace = joinedWorkspaceInfo
        )
        return AuthOutcome(response = response, refreshToken = refreshToken)
    }
}
