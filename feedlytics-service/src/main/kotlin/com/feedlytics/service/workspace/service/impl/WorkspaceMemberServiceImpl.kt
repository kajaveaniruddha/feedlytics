package com.feedlytics.service.workspace.service.impl

import com.feedlytics.service.common.exception.BadRequestException
import com.feedlytics.service.common.exception.ForbiddenException
import com.feedlytics.service.common.exception.NotFoundException
import com.feedlytics.service.common.repository.UserRepository
import com.feedlytics.service.workspace.config.PlanLimits
import com.feedlytics.service.workspace.dto.MemberWithUserDto
import com.feedlytics.service.workspace.dto.request.UpdateMemberRoleRequest
import com.feedlytics.service.workspace.dto.response.MemberData
import com.feedlytics.service.workspace.dto.response.MemberListResponse
import com.feedlytics.service.workspace.dto.response.MemberResponse
import com.feedlytics.service.workspace.entity.WorkspacesEntity
import com.feedlytics.service.workspace.entity.enums.WorkspaceRoleEnum
import com.feedlytics.service.workspace.repository.WorkspaceMembersRepository
import com.feedlytics.service.workspace.repository.WorkspaceRepository
import com.feedlytics.service.workspace.service.InviteService
import com.feedlytics.service.workspace.service.WorkspaceMemberService
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class WorkspaceMemberServiceImpl(
    private val workspaceRepository: WorkspaceRepository,
    private val workspaceMemberRepository: WorkspaceMembersRepository,
    private val userRepository: UserRepository,
    private val inviteService: InviteService
) : WorkspaceMemberService {

    @Transactional(readOnly = true)
    override fun getMembers(workspacePublicId: UUID, requesterId: Long): MemberListResponse {
        val workspace = findWorkspaceByPublicId(workspacePublicId)
        requireMembership(workspace.id, requesterId)
        checkWorkspaceAccessible(workspace)

        val members = workspaceMemberRepository.findAllMembersWithUserByWorkspaceId(workspace.id)
        val pendingInvites = inviteService.getPendingInvites(workspace.id)

        return MemberListResponse(
            members = members.map { it.toMemberData() },
            pendingInvites = pendingInvites
        )
    }

    @Transactional
    override fun updateMemberRole(
        workspacePublicId: UUID,
        memberUserPublicId: UUID,
        request: UpdateMemberRoleRequest,
        requesterId: Long
    ): MemberResponse {
        val workspace = findWorkspaceByPublicId(workspacePublicId)
        checkWorkspaceAccessible(workspace)

        val requesterMember = requireOwnerOrAdmin(workspace.id, requesterId)
        val targetMember = workspaceMemberRepository.findMemberWithUserByWorkspaceIdAndUserPublicId(
            workspace.id, memberUserPublicId
        ) ?: throw NotFoundException("MEMBER_NOT_FOUND", "Member not found")

        // Cannot change owner's role
        if (targetMember.role == WorkspaceRoleEnum.OWNER) {
            throw ForbiddenException("CANNOT_CHANGE_OWNER", "Cannot change owner's role")
        }

        // Cannot set role to OWNER
        if (request.role == WorkspaceRoleEnum.OWNER) {
            throw BadRequestException("INVALID_ROLE", "Cannot assign OWNER role. Use transfer ownership instead.")
        }

        // Admin cannot change another admin's role
        if (requesterMember.role == WorkspaceRoleEnum.ADMIN && targetMember.role == WorkspaceRoleEnum.ADMIN) {
            throw ForbiddenException("INSUFFICIENT_PERMISSION", "Admin cannot change another admin's role")
        }

        val targetUser = userRepository.findByPublicId(memberUserPublicId)
            ?: throw NotFoundException("USER_NOT_FOUND", "User not found")

        val membership = workspaceMemberRepository.findByUserIdAndWorkspaceId(targetUser.id, workspace.id)
            ?: throw NotFoundException("MEMBER_NOT_FOUND", "Member not found")

        membership.role = request.role
        workspaceMemberRepository.save(membership)

        val updatedMember = workspaceMemberRepository.findMemberWithUserByWorkspaceIdAndUserPublicId(
            workspace.id, memberUserPublicId
        )!!

        return MemberResponse(
            message = "Member role updated successfully.",
            member = updatedMember.toMemberData()
        )
    }

    @Transactional
    override fun removeMember(
        workspacePublicId: UUID,
        memberUserPublicId: UUID,
        requesterId: Long
    ) {
        val workspace = findWorkspaceByPublicId(workspacePublicId)
        checkWorkspaceAccessible(workspace)

        val requesterMember = requireOwnerOrAdmin(workspace.id, requesterId)
        val targetMember = workspaceMemberRepository.findMemberWithUserByWorkspaceIdAndUserPublicId(
            workspace.id, memberUserPublicId
        ) ?: throw NotFoundException("MEMBER_NOT_FOUND", "Member not found")

        // Cannot remove owner
        if (targetMember.role == WorkspaceRoleEnum.OWNER) {
            throw ForbiddenException("CANNOT_REMOVE_OWNER", "Cannot remove workspace owner")
        }

        // Admin cannot remove another admin
        if (requesterMember.role == WorkspaceRoleEnum.ADMIN && targetMember.role == WorkspaceRoleEnum.ADMIN) {
            throw ForbiddenException("INSUFFICIENT_PERMISSION", "Admin cannot remove another admin")
        }

        val targetUser = userRepository.findByPublicId(memberUserPublicId)
            ?: throw NotFoundException("USER_NOT_FOUND", "User not found")

        workspaceMemberRepository.deleteByWorkspaceIdAndUserId(workspace.id, targetUser.id)
    }

    @Transactional
    override fun leaveWorkspace(workspacePublicId: UUID, userId: Long) {
        val workspace = findWorkspaceByPublicId(workspacePublicId)
        val membership = workspaceMemberRepository.findByUserIdAndWorkspaceId(userId, workspace.id)
            ?: throw ForbiddenException("NOT_A_MEMBER", "You are not a member of this workspace")

        // Owner cannot leave - must transfer ownership first
        if (membership.role == WorkspaceRoleEnum.OWNER) {
            throw ForbiddenException("OWNER_CANNOT_LEAVE", "Owner cannot leave workspace. Transfer ownership first or delete the workspace.")
        }

        workspaceMemberRepository.deleteByWorkspaceIdAndUserId(workspace.id, userId)
    }

    private fun findWorkspaceByPublicId(publicId: UUID): WorkspacesEntity {
        return workspaceRepository.findByPublicId(publicId)
            ?: throw NotFoundException("WORKSPACE_NOT_FOUND", "Workspace not found")
    }

    private fun requireMembership(workspaceId: Long, userId: Long) {
        if (!workspaceMemberRepository.existsByUserIdAndWorkspaceId(userId, workspaceId)) {
            throw ForbiddenException("FORBIDDEN", "You are not a member of this workspace")
        }
    }

    private fun requireOwnerOrAdmin(workspaceId: Long, userId: Long): MemberWithUserDto {
        val user = userRepository.findById(userId)
            .orElseThrow { NotFoundException("USER_NOT_FOUND", "User not found") }

        val member = workspaceMemberRepository.findMemberWithUserByWorkspaceIdAndUserPublicId(workspaceId, user.publicId)
            ?: throw ForbiddenException("FORBIDDEN", "You are not a member of this workspace")

        if (member.role != WorkspaceRoleEnum.OWNER && member.role != WorkspaceRoleEnum.ADMIN) {
            throw ForbiddenException("INSUFFICIENT_PERMISSION", "Only owner or admin can perform this action")
        }

        return member
    }

    private fun checkWorkspaceAccessible(workspace: WorkspacesEntity) {
        if (!PlanLimits.isAccessible(workspace.plan)) {
            throw ForbiddenException(
                "WORKSPACE_ARCHIVED",
                "This workspace has been archived due to plan limits."
            )
        }
    }

    private fun MemberWithUserDto.toMemberData(): MemberData {
        return MemberData(
            userPublicId = this.userPublicId,
            name = this.userName,
            email = this.userEmail,
            avatarUrl = this.userAvatarUrl,
            role = this.role,
            status = this.status,
            joinedAt = this.joinedAt
        )
    }
}
