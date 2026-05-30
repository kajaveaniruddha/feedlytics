package com.feedlytics.service.workspace.service.impl

import com.feedlytics.service.common.exception.BadRequestException
import com.feedlytics.service.common.exception.ForbiddenException
import com.feedlytics.service.common.exception.LimitExceededException
import com.feedlytics.service.common.exception.NotFoundException
import com.feedlytics.service.common.repository.UserRepository
import com.feedlytics.service.feedback.entity.enums.SourceTypeEnum
import com.feedlytics.service.feedback.repository.FeedbacksRepository
import com.feedlytics.service.feedback.service.FeedbacksService
import com.feedlytics.service.workspace.planlimits.PlanLimitStrategyFactory
import com.feedlytics.service.workspace.planlimits.WorkspaceFreePlanConstants
import com.feedlytics.service.workspace.dto.WorkspaceWithRoleDto
import com.feedlytics.service.workspace.dto.request.CreateWorkspaceRequest
import com.feedlytics.service.workspace.dto.request.TransferOwnershipRequest
import com.feedlytics.service.workspace.dto.request.UpdateWorkspaceRequest
import com.feedlytics.service.workspace.dto.response.WorkspaceData
import com.feedlytics.service.workspace.dto.response.WorkspaceListResponse
import com.feedlytics.service.workspace.dto.response.WorkspacePlanUsageBySourceType
import com.feedlytics.service.workspace.dto.response.WorkspacePlanUsageLimitKind
import com.feedlytics.service.workspace.dto.response.WorkspacePlanUsageMetric
import com.feedlytics.service.workspace.dto.response.WorkspacePlanUsageResponse
import com.feedlytics.service.workspace.dto.response.WorkspaceResponse
import com.feedlytics.service.workspace.entity.WorkspaceMembersEntity
import com.feedlytics.service.workspace.entity.WorkspacesEntity
import com.feedlytics.service.workspace.entity.enums.MemberStatusEnum
import com.feedlytics.service.workspace.entity.enums.PlansEnum
import com.feedlytics.service.workspace.entity.enums.WorkspaceRoleEnum
import com.feedlytics.service.workspace.repository.WorkspaceMembersRepository
import com.feedlytics.service.workspace.repository.WorkspaceRepository
import com.feedlytics.service.widget.WidgetDefaults
import com.feedlytics.service.widget.repository.WidgetRepository
import com.feedlytics.service.workspace.service.UsageLimitService
import com.feedlytics.service.workspace.service.WorkspacePlanService
import com.feedlytics.service.workspace.service.WorkspaceService
import com.feedlytics.service.workspace.usage.BillingPeriod
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class WorkspaceServiceImpl(
    private val workspaceRepository: WorkspaceRepository,
    private val workspaceMemberRepository: WorkspaceMembersRepository,
    private val workspacePlanService: WorkspacePlanService,
    private val feedbacksService: FeedbacksService,
    private val feedbacksRepository: FeedbacksRepository,
    private val usageLimitService: UsageLimitService,
    private val userRepository: UserRepository,
    private val planLimitStrategyFactory: PlanLimitStrategyFactory,
    private val widgetRepository: WidgetRepository,
) : WorkspaceService {

    @Transactional
    override fun createWorkspace(request: CreateWorkspaceRequest, userId: Long): WorkspaceResponse {
        checkFreeWorkspaceLimit(userId)

        val workspace = WorkspacesEntity(
            name = request.name,
            description = request.description,
            ownerId = userId
        )
        val savedWorkspace = workspaceRepository.save(workspace)

        val member = WorkspaceMembersEntity(
            workspaceId = savedWorkspace.id,
            userId = userId,
            role = WorkspaceRoleEnum.OWNER,
            status = MemberStatusEnum.ACTIVE
        )
        workspaceMemberRepository.save(member)

        widgetRepository.save(WidgetDefaults.newEntityForWorkspace(savedWorkspace.id))

        return WorkspaceResponse(
            message = "Workspace created successfully.",
            workspace = toWorkspaceData(savedWorkspace, WorkspaceRoleEnum.OWNER, MemberStatusEnum.ACTIVE)
        )
    }

    @Transactional(readOnly = true)
    override fun getWorkspacesForUser(userId: Long): WorkspaceListResponse {
        val workspacesWithRole = workspaceRepository.findAllByMemberUserId(userId)

        val workspaceDataList = workspacesWithRole.map { it.toWorkspaceData() }

        return WorkspaceListResponse(workspaces = workspaceDataList)
    }

    @Transactional(readOnly = true)
    override fun getWorkspace(workspacePublicId: UUID, userId: Long): WorkspaceResponse {
        val workspace = findWorkspaceByPublicId(workspacePublicId)
        val membership = findMembership(workspace.id, userId)

        checkWorkspaceAccessible(workspace)

        return WorkspaceResponse(
            workspace = toWorkspaceData(workspace, membership.role, membership.status)
        )
    }

    @Transactional(readOnly = true)
    override fun getWorkspacePlanUsage(workspacePublicId: UUID, userId: Long): WorkspacePlanUsageResponse {
        val workspace = findWorkspaceByPublicId(workspacePublicId)
        findMembership(workspace.id, userId)
        checkWorkspaceAccessible(workspace)

        val limits = planLimitStrategyFactory.getStrategy(workspace.plan).toPlanLimit()
        val usage = usageLimitService.getCurrentUsage(workspace.id)
        val periodStart = usage.periodStart
        val periodEnd = BillingPeriod.nextUtcMonthStart(periodStart)

        val countsBySourceType = feedbacksRepository.getFeedbackUsageBySourceType(
            workspaceId = workspace.id,
            periodStart = periodStart,
            periodEnd = periodEnd,
        ).associate { row ->
            SourceTypeEnum.valueOf(row.sourceType) to (row.usedCount ?: 0L)
        }

        val feedbacksBySourceType = SourceTypeEnum.entries.map { sourceType ->
            val limitKind = if (sourceType == SourceTypeEnum.API_KEY) {
                WorkspacePlanUsageLimitKind.API_MONTHLY
            } else {
                WorkspacePlanUsageLimitKind.SHARED_MONTHLY_FEEDBACK
            }
            val limit = if (sourceType == SourceTypeEnum.API_KEY) {
                limits.maxApiCallsPerMonth
            } else {
                limits.maxFeedbacksPerMonth
            }
            WorkspacePlanUsageBySourceType(
                sourceType = sourceType,
                used = countsBySourceType[sourceType] ?: 0L,
                limit = limit,
                limitKind = limitKind,
            )
        }

        return WorkspacePlanUsageResponse(
            plan = workspace.plan,
            periodStart = periodStart,
            periodEnd = periodEnd,
            monthlyFeedback = WorkspacePlanUsageMetric(
                used = usage.feedbackCount.toLong(),
                limit = limits.maxFeedbacksPerMonth,
            ),
            feedbacksBySourceType = feedbacksBySourceType,
            members = WorkspacePlanUsageMetric(
                used = workspaceMemberRepository.countByWorkspaceId(workspace.id),
                limit = limits.maxMembers,
            ),
        )
    }

    @Transactional
    override fun updateWorkspace(
        workspacePublicId: UUID,
        request: UpdateWorkspaceRequest,
        userId: Long
    ): WorkspaceResponse {
        val workspace = findWorkspaceByPublicId(workspacePublicId)
        requireOwnerOrAdmin(workspace.id, userId)
        checkWorkspaceAccessible(workspace)

        request.name?.let { workspace.name = it }
        request.description?.let { workspace.description = it }

        val savedWorkspace = workspaceRepository.save(workspace)
        val membership = findMembership(workspace.id, userId)

        return WorkspaceResponse(
            message = "Workspace updated successfully.",
            workspace = toWorkspaceData(savedWorkspace, membership.role, membership.status)
        )
    }

    @Transactional
    override fun transferOwnership(
        workspacePublicId: UUID,
        request: TransferOwnershipRequest,
        requesterId: Long,
    ): WorkspaceResponse {
        val workspace = findWorkspaceByPublicId(workspacePublicId)
        checkWorkspaceAccessible(workspace)

        if (workspace.ownerId != requesterId) {
            throw ForbiddenException("FORBIDDEN", "Only the workspace owner can transfer ownership")
        }

        val outgoingOwnerMembership = findMembership(workspace.id, requesterId)
        if (outgoingOwnerMembership.role != WorkspaceRoleEnum.OWNER) {
            throw ForbiddenException("FORBIDDEN", "Only the workspace owner can transfer ownership")
        }

        val newOwnerUser = userRepository.findByPublicId(request.newOwnerUserPublicId)
            ?: throw NotFoundException("USER_NOT_FOUND", "User not found")

        if (newOwnerUser.id == requesterId) {
            throw BadRequestException("INVALID_REQUEST", "You cannot transfer ownership to yourself")
        }

        val incomingOwnerMembership = workspaceMemberRepository.findByUserIdAndWorkspaceId(newOwnerUser.id, workspace.id)
            ?: throw NotFoundException("MEMBER_NOT_FOUND", "The selected user is not a member of this workspace")

        if (incomingOwnerMembership.role != WorkspaceRoleEnum.ADMIN) {
            throw BadRequestException(
                "INVALID_NEW_OWNER",
                "Ownership can only be transferred to an existing workspace admin",
            )
        }

        // Demote current owner first so the DB partial unique index (one OWNER per workspace) is never violated
        outgoingOwnerMembership.role = WorkspaceRoleEnum.ADMIN
        workspaceMemberRepository.save(outgoingOwnerMembership)

        incomingOwnerMembership.role = WorkspaceRoleEnum.OWNER
        workspaceMemberRepository.save(incomingOwnerMembership)

        workspace.ownerId = newOwnerUser.id
        val savedWorkspace = workspaceRepository.save(workspace)

        return WorkspaceResponse(
            message = "Ownership transferred successfully.",
            workspace = toWorkspaceData(
                savedWorkspace,
                WorkspaceRoleEnum.ADMIN,
                outgoingOwnerMembership.status,
            ),
        )
    }

    @Transactional
    override fun deleteWorkspace(workspacePublicId: UUID, userId: Long) {
        val workspace = findWorkspaceByPublicId(workspacePublicId)

        if (workspace.ownerId != userId) {
            throw ForbiddenException("FORBIDDEN", "Only the owner can delete this workspace")
        }

        val ownerId = workspace.ownerId
        val wasArchived = workspace.plan == PlansEnum.ARCHIVED

        workspaceRepository.delete(workspace)

        // If deleted workspace was ARCHIVED, enforce limit again
        // (another archived workspace might now need to stay archived, or we might be fine)
        if (wasArchived) {
            workspacePlanService.enforceFreePlanLimit(ownerId)
        }
    }

    private fun checkFreeWorkspaceLimit(userId: Long) {
        val freeWorkspaceCount = workspaceRepository.countByOwnerIdAndPlan(userId, PlansEnum.FREE)
        if (freeWorkspaceCount >= WorkspaceFreePlanConstants.MAX_FREE_WORKSPACES_PER_USER) {
            throw LimitExceededException(
                "FREE_WORKSPACE_LIMIT_EXCEEDED",
                "You can only have ${WorkspaceFreePlanConstants.MAX_FREE_WORKSPACES_PER_USER} free workspaces. Upgrade an existing workspace to PRO or BUSINESS to create more."
            )
        }
    }

    private fun checkWorkspaceAccessible(workspace: WorkspacesEntity) {
        if (!planLimitStrategyFactory.getStrategy(workspace.plan).isAccessible()) {
            throw ForbiddenException(
                "WORKSPACE_ARCHIVED",
                "This workspace has been archived due to plan limits. Upgrade to PRO or BUSINESS to restore access."
            )
        }
    }

    private fun findWorkspaceByPublicId(publicId: UUID): WorkspacesEntity {
        return workspaceRepository.findByPublicId(publicId)
            ?: throw NotFoundException("WORKSPACE_NOT_FOUND", "Workspace not found")
    }

    private fun findMembership(workspaceId: Long, userId: Long): WorkspaceMembersEntity {
        return workspaceMemberRepository.findByUserIdAndWorkspaceId(userId, workspaceId)
            ?: throw ForbiddenException("FORBIDDEN", "You are not a member of this workspace")
    }

    private fun requireOwnerOrAdmin(workspaceId: Long, userId: Long) {
        val allowedRoles = listOf(WorkspaceRoleEnum.OWNER, WorkspaceRoleEnum.ADMIN)
        workspaceMemberRepository.findByUserIdAndWorkspaceIdAndRoleIn(userId, workspaceId, allowedRoles)
            ?: throw ForbiddenException("FORBIDDEN", "Only owner or admin can perform this action")
    }

    private fun toWorkspaceData(
        workspace: WorkspacesEntity,
        role: WorkspaceRoleEnum,
        status: MemberStatusEnum
    ): WorkspaceData {
        val feedbackStats = feedbacksService.getFeedbacksCountAndAvgRatings(workspace.id)
        val maxMembers = planLimitStrategyFactory.getStrategy(workspace.plan).toPlanLimit().maxMembers
        return WorkspaceData(
            publicId = workspace.publicId,
            name = workspace.name,
            description = workspace.description,
            plan = workspace.plan,
            role = role,
            status = status,
            memberCount = workspaceMemberRepository.countByWorkspaceId(workspace.id),
            maxMembers = maxMembers,
            feedbackCount = feedbackStats.totalFeedbacks,
            avgRating = feedbackStats.averageRating,
            createdAt = workspace.createdAt
        )
    }

    private fun WorkspaceWithRoleDto.toWorkspaceData(): WorkspaceData {
        val maxMembers = planLimitStrategyFactory.getStrategy(this.plan).toPlanLimit().maxMembers
        return WorkspaceData(
            publicId = this.publicId,
            name = this.name,
            description = this.description,
            plan = this.plan,
            role = this.role,
            status = this.status,
            memberCount = this.memberCount,
            maxMembers = maxMembers,
            feedbackCount = this.feedbackCount,
            avgRating = this.avgRating,
            createdAt = this.createdAt
        )
    }
}
