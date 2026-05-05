package com.feedlytics.service.feedback.service.impl

import com.feedlytics.service.common.exception.ForbiddenException
import com.feedlytics.service.common.exception.NotFoundException
import com.feedlytics.service.feedback.dto.response.FeedbackItemResponse
import com.feedlytics.service.feedback.dto.response.FeedbackOverviewAnalyticsResponse
import com.feedlytics.service.feedback.dto.response.FeedbacksCountAndAvgRatingsResponse
import com.feedlytics.service.feedback.entity.FeedbacksEntity
import com.feedlytics.service.feedback.repository.FeedbacksRepository
import com.feedlytics.service.feedback.service.FeedbacksService
import com.feedlytics.service.workspace.entity.WorkspacesEntity
import com.feedlytics.service.workspace.entity.enums.WorkspaceRoleEnum
import com.feedlytics.service.workspace.repository.WorkspaceMembersRepository
import com.feedlytics.service.workspace.repository.WorkspaceRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class FeedbacksServiceImpl(
    private val feedbacksRepository: FeedbacksRepository,
    private val workspaceRepository: WorkspaceRepository,
    private val workspaceMembersRepository: WorkspaceMembersRepository,
) : FeedbacksService {

    @Transactional(readOnly = true)
    override fun getFeedbacksCountAndAvgRatings(workspaceId: Long): FeedbacksCountAndAvgRatingsResponse {
        val feedbackStats = feedbacksRepository.getFeedbacksCountAndAvgRatings(workspaceId)
        return FeedbacksCountAndAvgRatingsResponse(
            publicId = feedbackStats.publicId,
            totalFeedbacks = feedbackStats.totalFeedbacks,
            averageRating = feedbackStats.averageRating ?: 0.0,
        )
    }

    @Transactional(readOnly = true)
    override fun getAllFeedbacksByWorkspaceId(workspaceId: Long): List<FeedbacksEntity> {
        return feedbacksRepository.findAllByWorkspaceId(workspaceId)
    }

    @Transactional(readOnly = true)
    override fun getFeedbacksOverviewAnalytics(workspaceId: Long): FeedbackOverviewAnalyticsResponse {
        return feedbacksRepository.getFeedbacksOverviewAnalytics(workspaceId)
            ?: throw NotFoundException("WORKSPACE_NOT_FOUND", "Workspace not found")
    }

    @Transactional(readOnly = true)
    override fun listFeedbacksForMember(workspacePublicId: UUID, userId: Long): List<FeedbackItemResponse> {
        val workspace = resolveWorkspaceForMember(workspacePublicId, userId)
        return feedbacksRepository.findAllByWorkspaceId(workspace.id).map { it.toItemResponse() }
    }

    @Transactional(readOnly = true)
    override fun getMetricsForMember(workspacePublicId: UUID, userId: Long): FeedbacksCountAndAvgRatingsResponse {
        val workspace = resolveWorkspaceForMember(workspacePublicId, userId)
        return getFeedbacksCountAndAvgRatings(workspace.id)
    }

    @Transactional(readOnly = true)
    override fun getOverviewAnalyticsForMember(workspacePublicId: UUID, userId: Long): FeedbackOverviewAnalyticsResponse {
        val workspace = resolveWorkspaceForMember(workspacePublicId, userId)
        return getFeedbacksOverviewAnalytics(workspace.id)
    }

    @Transactional
    override fun deleteFeedbackForMember(workspacePublicId: UUID, feedbackPublicId: UUID, userId: Long) {
        val workspace = resolveWorkspaceForMember(workspacePublicId, userId)
        requireOwnerOrAdminForFeedback(workspace.id, userId)
        val feedback = feedbacksRepository.findByPublicId(feedbackPublicId)
            ?: throw NotFoundException("FEEDBACK_NOT_FOUND", "Feedback not found")
        if (feedback.workspaceId != workspace.id) {
            throw NotFoundException("FEEDBACK_NOT_FOUND", "Feedback not found")
        }

        feedbacksRepository.delete(feedback)
    }

    private fun resolveWorkspaceForMember(workspacePublicId: UUID, userId: Long): WorkspacesEntity {
        val workspace = workspaceRepository.findByPublicId(workspacePublicId)
            ?: throw NotFoundException("WORKSPACE_NOT_FOUND", "Workspace not found")
        workspaceMembersRepository.findByUserIdAndWorkspaceId(userId, workspace.id)
            ?: throw ForbiddenException("FORBIDDEN", "You are not a member of this workspace")
        return workspace
    }

    private fun requireOwnerOrAdminForFeedback(workspaceId: Long, userId: Long) {
        val membership = workspaceMembersRepository.findByUserIdAndWorkspaceId(userId, workspaceId)
            ?: throw ForbiddenException("FORBIDDEN", "You are not a member of this workspace")
        if (membership.role != WorkspaceRoleEnum.OWNER && membership.role != WorkspaceRoleEnum.ADMIN) {
            throw ForbiddenException(
                "INSUFFICIENT_PERMISSION",
                "Only workspace owner or admin can delete feedback",
            )
        }
    }

    private fun FeedbacksEntity.toItemResponse(): FeedbackItemResponse =
        FeedbackItemResponse(
            publicId = publicId,
            sourceType = sourceType,
            content = content,
            rating = rating,
            createdAt = createdAt,
            updatedAt = updatedAt,
        )
}
