package com.feedlytics.service.workspace.service.impl

import com.feedlytics.service.common.exception.BadRequestException
import com.feedlytics.service.common.exception.ConflictException
import com.feedlytics.service.common.exception.ForbiddenException
import com.feedlytics.service.common.exception.LimitExceededException
import com.feedlytics.service.common.exception.NotFoundException
import com.feedlytics.service.common.repository.UserRepository
import com.feedlytics.service.workspace.config.PlanLimits
import com.feedlytics.service.workspace.dto.request.InviteMemberRequest
import com.feedlytics.service.workspace.dto.response.AcceptInviteResult
import com.feedlytics.service.workspace.dto.response.InviteData
import com.feedlytics.service.workspace.dto.response.MemberData
import com.feedlytics.service.workspace.dto.response.PendingInviteInfo
import com.feedlytics.service.workspace.entity.InviteEntity
import com.feedlytics.service.workspace.entity.WorkspaceMembersEntity
import com.feedlytics.service.workspace.entity.WorkspacesEntity
import com.feedlytics.service.workspace.entity.enums.InviteStatusEnum
import com.feedlytics.service.workspace.entity.enums.MemberStatusEnum
import com.feedlytics.service.workspace.entity.enums.WorkspaceRoleEnum
import com.feedlytics.service.workspace.repository.InviteRepository
import com.feedlytics.service.workspace.repository.WorkspaceMembersRepository
import com.feedlytics.service.workspace.repository.WorkspaceRepository
import com.feedlytics.service.workspace.service.InviteService
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.security.SecureRandom
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.Base64
import java.util.UUID

@Service
class InviteServiceImpl(
    private val inviteRepository: InviteRepository,
    private val workspaceRepository: WorkspaceRepository,
    private val workspaceMemberRepository: WorkspaceMembersRepository,
    private val userRepository: UserRepository
) : InviteService {

    private val logger = LoggerFactory.getLogger(InviteServiceImpl::class.java)

    companion object {
        private const val INVITE_EXPIRY_DAYS = 7L
        private const val TOKEN_LENGTH = 32
    }

    @Transactional
    override fun inviteMember(
        workspacePublicId: UUID,
        request: InviteMemberRequest,
        inviterId: Long
    ): InviteData {
        val workspace = findWorkspaceByPublicId(workspacePublicId)
        checkWorkspaceAccessible(workspace)
        requireOwnerOrAdmin(workspace.id, inviterId)

        val inviterMembership = workspaceMemberRepository.findByUserIdAndWorkspaceId(inviterId, workspace.id)
            ?: throw ForbiddenException("FORBIDDEN", "You are not a member of this workspace")

        // Cannot invite as OWNER
        if (request.role == WorkspaceRoleEnum.OWNER) {
            throw BadRequestException("INVALID_ROLE", "Cannot invite as OWNER")
        }

        // Only the owner may invite someone as ADMIN; admins may invite MEMBER only
        if (inviterMembership.role == WorkspaceRoleEnum.ADMIN && request.role == WorkspaceRoleEnum.ADMIN) {
            throw ForbiddenException(
                "INSUFFICIENT_PERMISSION",
                "Only the workspace owner can invite a member as admin",
            )
        }

        // Check if user is already a member
        val existingUser = userRepository.findByEmail(request.email)
        if (existingUser != null) {
            val isMember = workspaceMemberRepository.existsByUserIdAndWorkspaceId(existingUser.id, workspace.id)
            if (isMember) {
                throw ConflictException("ALREADY_MEMBER", "User is already a member of this workspace")
            }
        }

        // Check if there's already a pending invite for this email
        val existingInvite = inviteRepository.findByWorkspaceIdAndEmailAndStatus(
            workspace.id, request.email, InviteStatusEnum.PENDING
        )
        if (existingInvite != null && !existingInvite.isExpired()) {
            throw ConflictException("INVITE_ALREADY_SENT", "An invite has already been sent to this email")
        }

        // Check member limit
        val planLimits = PlanLimits.forPlan(workspace.plan)
        val currentMemberCount = workspaceMemberRepository.countByWorkspaceId(workspace.id)
        val pendingInviteCount = inviteRepository.findAllByWorkspaceIdAndStatus(workspace.id, InviteStatusEnum.PENDING)
            .count { !it.isExpired() }

        if (currentMemberCount + pendingInviteCount >= planLimits.maxMembers) {
            throw LimitExceededException(
                "MEMBER_LIMIT_EXCEEDED",
                "Workspace has reached maximum member limit (${planLimits.maxMembers}). Upgrade plan to invite more members."
            )
        }

        // Create invite
        val token = generateToken()
        val invite = InviteEntity(
            workspaceId = workspace.id,
            email = request.email,
            role = request.role,
            token = token,
            expiresAt = Instant.now().plus(INVITE_EXPIRY_DAYS, ChronoUnit.DAYS)
        )
        val savedInvite = inviteRepository.save(invite)

        logger.info("Invite created for {} to workspace {} with role {}. Token: {}", 
            request.email, workspace.id, request.role, token)

        // TODO: Send invite email with token

        return savedInvite.toInviteData(includeToken = true, token = token)
    }

    @Transactional(readOnly = true)
    override fun getPendingInvites(workspaceId: Long): List<InviteData> {
        return inviteRepository.findAllByWorkspaceIdAndStatus(workspaceId, InviteStatusEnum.PENDING)
            .filter { !it.isExpired() }
            .map { it.toInviteData() }
    }

    @Transactional
    override fun acceptInvite(token: String, userId: Long): AcceptInviteResult {
        val invite = inviteRepository.findByToken(token)
            ?: throw NotFoundException("INVITE_NOT_FOUND", "Invite not found or invalid")

        if (invite.status != InviteStatusEnum.PENDING) {
            throw BadRequestException("INVITE_NOT_PENDING", "Invite has already been ${invite.status.name.lowercase()}")
        }

        if (invite.isExpired()) {
            invite.status = InviteStatusEnum.EXPIRED
            inviteRepository.save(invite)
            throw BadRequestException("INVITE_EXPIRED", "Invite has expired")
        }

        val user = userRepository.findById(userId)
            .orElseThrow { NotFoundException("USER_NOT_FOUND", "User not found") }

        // Verify email matches
        if (!user.email.equals(invite.email, ignoreCase = true)) {
            throw ForbiddenException("EMAIL_MISMATCH", "This invite was sent to a different email address")
        }

        // Check if already a member
        if (workspaceMemberRepository.existsByUserIdAndWorkspaceId(userId, invite.workspaceId)) {
            invite.status = InviteStatusEnum.ACCEPTED
            inviteRepository.save(invite)
            throw ConflictException("ALREADY_MEMBER", "You are already a member of this workspace")
        }

        val workspace = workspaceRepository.findById(invite.workspaceId)
            .orElseThrow { NotFoundException("WORKSPACE_NOT_FOUND", "Workspace not found") }

        // Create membership
        val member = WorkspaceMembersEntity(
            workspaceId = invite.workspaceId,
            userId = userId,
            role = invite.role,
            status = MemberStatusEnum.ACTIVE
        )
        workspaceMemberRepository.save(member)

        // Mark invite as accepted
        invite.status = InviteStatusEnum.ACCEPTED
        inviteRepository.save(invite)

        logger.info("User {} accepted invite to workspace {}", userId, invite.workspaceId)

        return AcceptInviteResult(
            workspacePublicId = workspace.publicId,
            workspaceName = workspace.name,
            member = MemberData(
                userPublicId = user.publicId,
                name = user.name,
                email = user.email,
                avatarUrl = user.avatarUrl,
                role = invite.role,
                status = MemberStatusEnum.ACTIVE,
                joinedAt = member.createdAt
            )
        )
    }

    @Transactional
    override fun cancelInvite(workspacePublicId: UUID, inviteId: UUID, requesterId: Long) {
        val workspace = findWorkspaceByPublicId(workspacePublicId)
        requireOwnerOrAdmin(workspace.id, requesterId)

        val invite = inviteRepository.findById(inviteId)
            .orElseThrow { NotFoundException("INVITE_NOT_FOUND", "Invite not found") }

        if (invite.workspaceId != workspace.id) {
            throw NotFoundException("INVITE_NOT_FOUND", "Invite not found in this workspace")
        }

        if (invite.status != InviteStatusEnum.PENDING) {
            throw BadRequestException("INVITE_NOT_PENDING", "Can only cancel pending invites")
        }

        invite.status = InviteStatusEnum.CANCELLED
        inviteRepository.save(invite)

        logger.info("Invite {} cancelled for workspace {}", inviteId, workspace.id)
    }

    @Transactional
    override fun resendInvite(workspacePublicId: UUID, inviteId: UUID, requesterId: Long): InviteData {
        val workspace = findWorkspaceByPublicId(workspacePublicId)
        checkWorkspaceAccessible(workspace)
        requireOwnerOrAdmin(workspace.id, requesterId)

        val invite = inviteRepository.findById(inviteId)
            .orElseThrow { NotFoundException("INVITE_NOT_FOUND", "Invite not found") }

        if (invite.workspaceId != workspace.id) {
            throw NotFoundException("INVITE_NOT_FOUND", "Invite not found in this workspace")
        }

        if (invite.status != InviteStatusEnum.PENDING) {
            throw BadRequestException("INVITE_NOT_PENDING", "Can only resend pending invites")
        }

        // Cancel old invite and create new one with fresh expiry
        invite.status = InviteStatusEnum.CANCELLED
        inviteRepository.save(invite)

        val newToken = generateToken()
        val newInvite = InviteEntity(
            workspaceId = workspace.id,
            email = invite.email,
            role = invite.role,
            token = newToken,
            expiresAt = Instant.now().plus(INVITE_EXPIRY_DAYS, ChronoUnit.DAYS)
        )
        val savedInvite = inviteRepository.save(newInvite)

        logger.info("Invite resent to {} for workspace {}. New token: {}", invite.email, workspace.id, newToken)

        // TODO: Send invite email with new token

        return savedInvite.toInviteData(includeToken = true, token = newToken)
    }

    @Transactional(readOnly = true)
    override fun getPendingInvitesForUser(email: String): List<PendingInviteInfo> {
        return inviteRepository.findAllByEmailAndStatus(email, InviteStatusEnum.PENDING)
            .filter { !it.isExpired() }
            .mapNotNull { invite ->
                val workspace = workspaceRepository.findById(invite.workspaceId).orElse(null)
                workspace?.let {
                    PendingInviteInfo(
                        inviteId = invite.id,
                        workspacePublicId = it.publicId,
                        workspaceName = it.name,
                        role = invite.role.name,
                        invitedAt = invite.createdAt,
                        expiresAt = invite.expiresAt
                    )
                }
            }
    }

    @Transactional
    override fun tryAcceptInviteAfterAuth(token: String, userId: Long, userEmail: String): AcceptInviteResult? {
        val invite = inviteRepository.findByToken(token) ?: return null

        if (invite.status != InviteStatusEnum.PENDING) return null
        if (invite.isExpired()) return null
        if (!invite.email.equals(userEmail, ignoreCase = true)) return null
        if (workspaceMemberRepository.existsByUserIdAndWorkspaceId(userId, invite.workspaceId)) {
            invite.status = InviteStatusEnum.ACCEPTED
            inviteRepository.save(invite)
            return null
        }

        val workspace = workspaceRepository.findById(invite.workspaceId).orElse(null) ?: return null
        val user = userRepository.findById(userId).orElse(null) ?: return null

        val member = WorkspaceMembersEntity(
            workspaceId = invite.workspaceId,
            userId = userId,
            role = invite.role,
            status = MemberStatusEnum.ACTIVE
        )
        workspaceMemberRepository.save(member)

        invite.status = InviteStatusEnum.ACCEPTED
        inviteRepository.save(invite)

        logger.info("User {} auto-accepted invite to workspace {} after auth", userId, invite.workspaceId)

        return AcceptInviteResult(
            workspacePublicId = workspace.publicId,
            workspaceName = workspace.name,
            member = MemberData(
                userPublicId = user.publicId,
                name = user.name,
                email = user.email,
                avatarUrl = user.avatarUrl,
                role = invite.role,
                status = MemberStatusEnum.ACTIVE,
                joinedAt = member.createdAt
            )
        )
    }

    @Transactional(readOnly = true)
    override fun isValidInviteForEmail(token: String, email: String): Boolean {
        val invite = inviteRepository.findByToken(token) ?: return false
        
        if (invite.status != InviteStatusEnum.PENDING) return false
        if (invite.isExpired()) return false
        if (!invite.email.equals(email, ignoreCase = true)) return false
        
        return true
    }

    @Transactional(readOnly = true)
    override fun validateInviteToken(token: String, email: String) {
        val invite = inviteRepository.findByToken(token)
            ?: throw BadRequestException("INVALID_INVITE_TOKEN", "Invalid or expired invite token")
        
        if (invite.status != InviteStatusEnum.PENDING) {
            throw BadRequestException("INVITE_NOT_PENDING", "This invite has already been ${invite.status.name.lowercase()}")
        }
        
        if (invite.isExpired()) {
            throw BadRequestException("INVITE_EXPIRED", "This invite has expired")
        }
        
        if (!invite.email.equals(email, ignoreCase = true)) {
            throw BadRequestException(
                "INVITE_EMAIL_MISMATCH",
                "This invite was sent to a different email address (${invite.email})"
            )
        }
    }

    private fun findWorkspaceByPublicId(publicId: UUID): WorkspacesEntity {
        return workspaceRepository.findByPublicId(publicId)
            ?: throw NotFoundException("WORKSPACE_NOT_FOUND", "Workspace not found")
    }

    private fun requireOwnerOrAdmin(workspaceId: Long, userId: Long) {
        val allowedRoles = listOf(WorkspaceRoleEnum.OWNER, WorkspaceRoleEnum.ADMIN)
        workspaceMemberRepository.findByUserIdAndWorkspaceIdAndRoleIn(userId, workspaceId, allowedRoles)
            ?: throw ForbiddenException("FORBIDDEN", "Only owner or admin can manage invites")
    }

    private fun checkWorkspaceAccessible(workspace: WorkspacesEntity) {
        if (!PlanLimits.isAccessible(workspace.plan)) {
            throw ForbiddenException("WORKSPACE_ARCHIVED", "This workspace has been archived")
        }
    }

    private fun generateToken(): String {
        val bytes = ByteArray(TOKEN_LENGTH)
        SecureRandom().nextBytes(bytes)
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes)
    }

    private fun InviteEntity.toInviteData(includeToken: Boolean = false, token: String? = null): InviteData {
        return InviteData(
            invitePublicId = this.id,
            email = this.email,
            role = this.role,
            status = this.status.name,
            expiresAt = this.expiresAt,
            createdAt = this.createdAt,
            token = if (includeToken) token else null
        )
    }
}
