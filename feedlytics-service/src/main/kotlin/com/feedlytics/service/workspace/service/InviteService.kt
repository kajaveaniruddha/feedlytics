package com.feedlytics.service.workspace.service

import com.feedlytics.service.workspace.dto.request.InviteMemberRequest
import com.feedlytics.service.workspace.dto.response.AcceptInviteResult
import com.feedlytics.service.workspace.dto.response.InviteData
import com.feedlytics.service.workspace.dto.response.PendingInviteInfo
import java.util.UUID

interface InviteService {

    /**
     * Send an invite to a user to join a workspace.
     * @return The created invite data
     */
    fun inviteMember(
        workspacePublicId: UUID,
        request: InviteMemberRequest,
        inviterId: Long
    ): InviteData

    /**
     * Get all pending invites for a workspace.
     */
    fun getPendingInvites(workspaceId: Long): List<InviteData>

    /**
     * Accept an invite using the token.
     * @return The new member data
     */
    fun acceptInvite(token: String, userId: Long): AcceptInviteResult

    /**
     * Cancel/revoke a pending invite.
     */
    fun cancelInvite(workspacePublicId: UUID, inviteId: UUID, requesterId: Long)

    /**
     * Resend an invite email.
     */
    fun resendInvite(workspacePublicId: UUID, inviteId: UUID, requesterId: Long): InviteData

    /**
     * Get all pending invites for a user (by their email).
     */
    fun getPendingInvitesForUser(email: String): List<PendingInviteInfo>

    /**
     * Accept invite after registration/login. 
     * Silently fails if token is invalid/expired (doesn't throw).
     * Used when user registers/logs in with an invite token.
     */
    fun tryAcceptInviteAfterAuth(token: String, userId: Long, userEmail: String): AcceptInviteResult?

    /**
     * Validates if an invite token is valid for a given email.
     * Used during registration to skip email verification.
     * @return true if token is valid, not expired, and matches the email
     */
    fun isValidInviteForEmail(token: String, email: String): Boolean

    /**
     * Validates invite token and throws appropriate error if invalid.
     * Used when we need to report specific error to user.
     * @throws BadRequestException if token is invalid, expired, or email mismatch
     */
    fun validateInviteToken(token: String, email: String)
}
