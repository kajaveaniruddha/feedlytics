package com.feedlytics.service.auth.dto.response

import com.feedlytics.service.common.entity.User
import com.feedlytics.service.workspace.dto.response.AcceptInviteResult
import java.util.UUID

/**
 * JSON body returned to the SPA on successful auth.
 *
 * Plan B: only the access token is exposed to JS; the refresh token is delivered
 * out-of-band via an HttpOnly Set-Cookie header, never serialized into JSON.
 */
data class AuthResponse(
    val success: Boolean = true,
    val accessToken: String,
    val expiresIn: Long,
    val user: UserInfo,
    val joinedWorkspace: JoinedWorkspaceInfo? = null
) {
    companion object {
        fun from(
            user: User,
            accessToken: String,
            expiresIn: Long,
            joinedWorkspace: JoinedWorkspaceInfo? = null
        ): AuthResponse {
            return AuthResponse(
                accessToken = accessToken,
                expiresIn = expiresIn,
                user = UserInfo.from(user),
                joinedWorkspace = joinedWorkspace
            )
        }

        fun from(
            user: User,
            accessToken: String,
            expiresIn: Long,
            acceptResult: AcceptInviteResult?
        ): AuthResponse {
            val joinedWorkspaceInfo = acceptResult?.let {
                JoinedWorkspaceInfo(
                    workspacePublicId = it.workspacePublicId,
                    workspaceName = it.workspaceName,
                    role = it.member.role.name
                )
            }
            return AuthResponse(
                accessToken = accessToken,
                expiresIn = expiresIn,
                user = UserInfo.from(user),
                joinedWorkspace = joinedWorkspaceInfo
            )
        }
    }
}

data class JoinedWorkspaceInfo(
    val workspacePublicId: UUID,
    val workspaceName: String,
    val role: String
)

data class UserInfo(
    val publicId: UUID,
    val email: String,
    val name: String,
    val avatarUrl: String?,
    val isEmailVerified: Boolean
) {
    companion object {
        fun from(user: User): UserInfo {
            return UserInfo(
                publicId = user.publicId,
                email = user.email,
                name = user.name,
                avatarUrl = user.avatarUrl,
                isEmailVerified = user.isEmailVerified
            )
        }
    }
}

/**
 * Internal result returned by the service layer to the controller.
 *
 * Bundles the public [AuthResponse] (serialized to JSON) with the plaintext
 * refresh token (placed into the HttpOnly cookie by the controller).
 * Refresh token must never leak into the response body.
 */
data class AuthOutcome(
    val response: AuthResponse,
    val refreshToken: String
)
