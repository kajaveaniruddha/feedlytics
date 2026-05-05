package com.feedlytics.service.feedback.service

import com.feedlytics.service.common.exception.ForbiddenException
import com.feedlytics.service.common.exception.LimitExceededException
import com.feedlytics.service.common.exception.NotFoundException
import com.feedlytics.service.feedback.dto.request.SendFeedbackRequest
import com.feedlytics.service.feedback.entity.FeedbackMetaDataEntity
import com.feedlytics.service.feedback.entity.FeedbacksEntity
import com.feedlytics.service.feedback.repository.FeedbackCategoriesRepository
import com.feedlytics.service.feedback.repository.FeedbackMetaDataRepository
import com.feedlytics.service.feedback.repository.FeedbacksRepository
import com.feedlytics.service.workspace.config.PlanLimits
import com.feedlytics.service.workspace.repository.WorkspaceRepository
import com.feedlytics.service.workspace.service.UsageLimitService
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.transaction.support.TransactionSynchronization
import org.springframework.transaction.support.TransactionSynchronizationManager
import java.util.UUID

@Service
class PublicSendFeedbackService(
    private val workspaceRepository: WorkspaceRepository,
    private val credentialService: WorkspaceSubmissionCredentialService,
    private val usageLimitService: UsageLimitService,
    private val feedbacksRepository: FeedbacksRepository,
    private val feedbackMetaDataRepository: FeedbackMetaDataRepository,
    private val feedbackCategoriesRepository: FeedbackCategoriesRepository,
    private val grpcEnqueueService: FeedbackAnalysisGrpcEnqueueService,
) {

    @Transactional
    fun send(
        workspacePublicId: UUID,
        body: SendFeedbackRequest,
        apiKey: String?,
        widgetSecret: String?,
        origin: String?,
        remoteIp: String?,
        userAgent: String?,
    ): Long {
        val workspace = workspaceRepository.findByPublicId(workspacePublicId)
            ?: throw NotFoundException("WORKSPACE_NOT_FOUND", "Workspace not found")

        if (!PlanLimits.isAccessible(workspace.plan)) {
            throw ForbiddenException("WORKSPACE_ARCHIVED", "This workspace cannot accept feedback")
        }

        credentialService.requireApiKeyOrWidgetSecret(workspace, apiKey, widgetSecret, origin)

        if (!usageLimitService.canSubmitFeedback(workspace.id, workspace.plan)) {
            throw LimitExceededException(
                "FEEDBACK_LIMIT",
                "Monthly feedback limit reached for this workspace",
            )
        }

        val feedback = FeedbacksEntity(
            workspaceId = workspace.id,
            sourceType = body.sourceType,
            content = body.content,
            rating = body.rating,
        )
        val savedFeedback = feedbacksRepository.saveAndFlush(feedback)

        val meta = FeedbackMetaDataEntity(
            feedbackId = savedFeedback.id,
            ipAddress = remoteIp,
            userAgent = userAgent,
            location = null,
        )
        feedbackMetaDataRepository.save(meta)

        usageLimitService.incrementFeedbackCount(workspace.id)

        val categoryNames = feedbackCategoriesRepository.findAllByWorkspaceIdOrderByNameAsc(workspace.id)
            .map { it.name }

        TransactionSynchronizationManager.registerSynchronization(
            object : TransactionSynchronization {
                override fun afterCommit() {
                    grpcEnqueueService.enqueueAfterCommit(savedFeedback, body, categoryNames)
                }
            },
        )

        return savedFeedback.id
    }
}
