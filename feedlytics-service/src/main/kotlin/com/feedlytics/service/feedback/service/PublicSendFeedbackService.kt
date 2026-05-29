package com.feedlytics.service.feedback.service

import com.feedlytics.service.common.exception.BadRequestException
import com.feedlytics.service.common.exception.ForbiddenException
import com.feedlytics.service.common.exception.LimitExceededException
import com.feedlytics.service.common.exception.NotFoundException
import com.feedlytics.service.feedback.dto.request.SendFeedbackRequest
import com.feedlytics.service.feedback.entity.FeedbackMetaDataEntity
import com.feedlytics.service.feedback.entity.FeedbacksEntity
import com.feedlytics.service.feedback.entity.enums.SourceTypeEnum
import com.feedlytics.service.feedback.repository.FeedbackCategoriesRepository
import com.feedlytics.service.feedback.repository.FeedbackMetaDataRepository
import com.feedlytics.service.feedback.repository.FeedbacksRepository
import com.feedlytics.service.widget.repository.WidgetRepository
import com.feedlytics.service.workspace.planlimits.PlanLimitStrategyFactory
import com.feedlytics.service.workspace.repository.WorkspaceRepository
import com.feedlytics.service.common.notification.Notification
import com.feedlytics.service.common.notification.NotificationChannelType
import com.feedlytics.service.common.notification.NotificationService
import com.feedlytics.service.feedback.auth.FeedbackAuthService
import com.feedlytics.service.workspace.service.UsageLimitService
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.transaction.support.TransactionSynchronization
import org.springframework.transaction.support.TransactionSynchronizationManager
import java.util.UUID

@Service
class PublicSendFeedbackService(
    private val workspaceRepository: WorkspaceRepository,
    private val feedbackAuthService: FeedbackAuthService,
    private val usageLimitService: UsageLimitService,
    private val feedbacksRepository: FeedbacksRepository,
    private val feedbackMetaDataRepository: FeedbackMetaDataRepository,
    private val feedbackCategoriesRepository: FeedbackCategoriesRepository,
    private val notificationService: NotificationService,
    private val planLimitStrategyFactory: PlanLimitStrategyFactory,
    private val widgetRepository: WidgetRepository,
) {

    private val submitterEmailPattern = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$".toRegex()

    @Transactional
    fun send(
        workspacePublicId: UUID,
        body: SendFeedbackRequest,
        apiKey: String?,
        widgetSecret: String?,
        origin: String?,
        remoteIp: String?,
        userAgent: String?,
        referrer: String?,
        acceptLanguage: String?,
    ): Long {
        val workspace = workspaceRepository.findByPublicId(workspacePublicId)
            ?: throw NotFoundException("WORKSPACE_NOT_FOUND", "Workspace not found")

        if (!planLimitStrategyFactory.getStrategy(workspace.plan).isAccessible()) {
            throw ForbiddenException("WORKSPACE_ARCHIVED", "This workspace cannot accept feedback")
        }

        val sourceType = feedbackAuthService.requireApiKeyOrWidgetSecret(
            workspace = workspace,
            apiKeyHeader = apiKey,
            widgetSecretHeader = widgetSecret,
            origin = origin,
            ipAddress = remoteIp,
        )

        if (body.sourceType != sourceType) {
            throw BadRequestException(
                "SOURCE_TYPE_MISMATCH",
                "sourceType must match the credential used (${sourceType.name})",
            )
        }

        if (!usageLimitService.canSubmitFeedback(workspace.id, workspace.plan)) {
            throw LimitExceededException(
                "FEEDBACK_LIMIT",
                "Monthly feedback limit reached for this workspace",
            )
        }

        val submitterName = body.submitterName?.trim()?.takeIf { it.isNotEmpty() }
        val submitterEmail = body.submitterEmail?.trim()?.takeIf { it.isNotEmpty() }
        if (submitterEmail != null && !submitterEmailPattern.matches(submitterEmail)) {
            throw BadRequestException("INVALID_SUBMITTER_EMAIL", "Invalid submitter email")
        }

        if (sourceType == SourceTypeEnum.WIDGET) {
            val widget = widgetRepository.findByWorkspaceId(workspace.id)
                ?: throw NotFoundException("WIDGET_NOT_FOUND", "Widget configuration not found")
            if (!widget.isActive) {
                throw ForbiddenException("WIDGET_INACTIVE", "This widget is not active")
            }
            if (widget.collectName && submitterName == null) {
                throw BadRequestException("SUBMITTER_NAME_REQUIRED", "Name is required")
            }
            if (widget.collectEmail && submitterEmail == null) {
                throw BadRequestException("SUBMITTER_EMAIL_REQUIRED", "Email is required")
            }
        }

        val feedback = FeedbacksEntity(
            workspaceId = workspace.id,
            sourceType = sourceType,
            content = body.content,
            rating = body.rating,
            submitterName = submitterName,
            submitterEmail = submitterEmail,
        )
        val savedFeedback = feedbacksRepository.saveAndFlush(feedback)

        val resolvedIp = remoteIp?.trim()?.takeIf { it.isNotEmpty() }
            ?: body.reportedIp?.trim()?.takeIf { it.isNotEmpty() }
        val resolvedUa = userAgent?.trim()?.takeIf { it.isNotEmpty() }
            ?: body.reportedUserAgent?.trim()?.takeIf { it.isNotEmpty() }
        val resolvedLocation = body.reportedLocation?.trim()?.takeIf { it.isNotEmpty() }

        val meta = FeedbackMetaDataEntity(
            feedbackId = savedFeedback.id,
            ipAddress = resolvedIp,
            userAgent = resolvedUa,
            location = resolvedLocation,
            referrer = referrer?.trim()?.takeIf { it.isNotEmpty() }?.take(MAX_REFERRER_LEN),
            acceptLanguage = acceptLanguage?.trim()?.takeIf { it.isNotEmpty() }?.take(MAX_ACCEPT_LANGUAGE_LEN),
        )
        feedbackMetaDataRepository.save(meta)

        usageLimitService.incrementFeedbackCount(workspace.id, workspace.plan, savedFeedback.id)

        val categoryNames = feedbackCategoriesRepository.findAllByWorkspaceIdOrderByNameAsc(workspace.id)
            .map { it.name }

        TransactionSynchronizationManager.registerSynchronization(
            object : TransactionSynchronization {
                override fun afterCommit() {
                    notificationService.notify(
                        NotificationChannelType.FEEDBACK_ANALYSIS_QUEUE,
                        Notification.FeedbackAnalysisEnqueue(
                            savedFeedback = savedFeedback,
                            request = body,
                            categoryNames = categoryNames,
                        ),
                    )
                }
            },
        )

        return savedFeedback.id
    }

    private companion object {
        const val MAX_REFERRER_LEN = 2048
        const val MAX_ACCEPT_LANGUAGE_LEN = 500
    }
}
