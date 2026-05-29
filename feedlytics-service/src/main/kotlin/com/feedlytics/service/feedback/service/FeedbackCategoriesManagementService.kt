package com.feedlytics.service.feedback.service

import com.feedlytics.service.common.exception.BadRequestException
import com.feedlytics.service.common.exception.ConflictException
import com.feedlytics.service.common.exception.ForbiddenException
import com.feedlytics.service.common.exception.LimitExceededException
import com.feedlytics.service.common.exception.NotFoundException
import com.feedlytics.service.feedback.dto.request.CreateFeedbackCategoryRequest
import com.feedlytics.service.feedback.dto.request.UpdateFeedbackCategoryRequest
import com.feedlytics.service.feedback.dto.response.FeedbackCategoryListResponse
import com.feedlytics.service.feedback.dto.response.FeedbackCategoryResponse
import com.feedlytics.service.feedback.repository.FeedbackCategoriesRepository
import com.feedlytics.service.workspace.planlimits.PlanLimitStrategyFactory
import com.feedlytics.service.workspace.entity.FeedbackCategoriesEntity
import com.feedlytics.service.workspace.entity.WorkspacesEntity
import com.feedlytics.service.workspace.entity.enums.WorkspaceRoleEnum
import com.feedlytics.service.workspace.repository.WorkspaceMembersRepository
import com.feedlytics.service.workspace.repository.WorkspaceRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class FeedbackCategoriesManagementService(
    private val workspaceRepository: WorkspaceRepository,
    private val workspaceMembersRepository: WorkspaceMembersRepository,
    private val feedbackCategoriesRepository: FeedbackCategoriesRepository,
    private val planLimitStrategyFactory: PlanLimitStrategyFactory,
) {

    @Transactional(readOnly = true)
    fun listForMember(workspacePublicId: UUID, userId: Long): FeedbackCategoryListResponse {
        val workspace = resolveWorkspaceForMember(workspacePublicId, userId)
        val max = planLimitStrategyFactory.getStrategy(workspace.plan).toPlanLimit().maxFeedbackCategoriesPerWorkspace
        val rows = feedbackCategoriesRepository.findAllByWorkspaceIdOrderByNameAsc(workspace.id)
        return FeedbackCategoryListResponse(
            categories = rows.map { FeedbackCategoryResponse(id = it.id, name = it.name) },
            maxCategories = max,
        )
    }

    @Transactional
    fun createForMember(
        workspacePublicId: UUID,
        userId: Long,
        request: CreateFeedbackCategoryRequest,
    ): FeedbackCategoryResponse {
        val workspace = resolveWorkspaceForMember(workspacePublicId, userId)
        requireCanManageCategories(workspace.id, userId)

        val max = planLimitStrategyFactory.getStrategy(workspace.plan).toPlanLimit().maxFeedbackCategoriesPerWorkspace
        if (max <= 0) {
            throw ForbiddenException("PLAN_NOT_ALLOWED", "This workspace plan cannot create feedback categories")
        }
        val current = feedbackCategoriesRepository.countByWorkspaceId(workspace.id)
        if (current >= max) {
            throw LimitExceededException(
                "CATEGORY_LIMIT",
                "Maximum number of feedback categories for this plan has been reached",
            )
        }

        val normalized = request.name.trim()
        if (feedbackCategoriesRepository.findByWorkspaceIdAndNameIgnoreCase(workspace.id, normalized) != null) {
            throw ConflictException("DUPLICATE_CATEGORY", "A category with this name already exists")
        }

        val saved = feedbackCategoriesRepository.save(
            FeedbackCategoriesEntity(name = normalized, workspaceId = workspace.id),
        )
        return FeedbackCategoryResponse(id = saved.id, name = saved.name)
    }

    @Transactional
    fun updateForMember(
        workspacePublicId: UUID,
        categoryId: Long,
        userId: Long,
        request: UpdateFeedbackCategoryRequest,
    ): FeedbackCategoryResponse {
        resolveWorkspaceForMember(workspacePublicId, userId)
        throw BadRequestException(
            "CATEGORY_IMMUTABLE",
            "Feedback categories cannot be renamed or removed after they are created.",
        )
    }

    @Transactional
    fun deleteForMember(workspacePublicId: UUID, categoryId: Long, userId: Long) {
        resolveWorkspaceForMember(workspacePublicId, userId)
        throw BadRequestException(
            "CATEGORY_IMMUTABLE",
            "Feedback categories cannot be renamed or removed after they are created.",
        )
    }

    private fun resolveWorkspaceForMember(workspacePublicId: UUID, userId: Long): WorkspacesEntity {
        val workspace = workspaceRepository.findByPublicId(workspacePublicId)
            ?: throw NotFoundException("WORKSPACE_NOT_FOUND", "Workspace not found")
        workspaceMembersRepository.findByUserIdAndWorkspaceId(userId, workspace.id)
            ?: throw ForbiddenException("FORBIDDEN", "You are not a member of this workspace")
        return workspace
    }

    private fun requireCanManageCategories(workspaceId: Long, userId: Long) {
        val membership = workspaceMembersRepository.findByUserIdAndWorkspaceId(userId, workspaceId)
            ?: throw ForbiddenException("FORBIDDEN", "You are not a member of this workspace")
        if (membership.role != WorkspaceRoleEnum.OWNER && membership.role != WorkspaceRoleEnum.ADMIN) {
            throw ForbiddenException(
                "INSUFFICIENT_PERMISSION",
                "Only workspace owner or admin can manage feedback categories",
            )
        }
    }
}
