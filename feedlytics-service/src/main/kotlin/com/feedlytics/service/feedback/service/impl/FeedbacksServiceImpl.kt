package com.feedlytics.service.feedback.service.impl

import com.feedlytics.service.common.exception.ForbiddenException
import com.feedlytics.service.common.exception.NotFoundException
import com.feedlytics.service.feedback.dto.response.CategoryAnalyticsBreakdown
import com.feedlytics.service.feedback.dto.response.CategoryAnalyticsItem
import com.feedlytics.service.feedback.dto.response.FeedbackItemResponse
import com.feedlytics.service.feedback.dto.response.DailyFeedbackCount
import com.feedlytics.service.feedback.dto.response.FeedbackOverviewAnalyticsResponse
import com.feedlytics.service.feedback.dto.response.FeedbacksCountAndAvgRatingsResponse
import com.feedlytics.service.feedback.dto.response.FeedbacksListResponse
import com.feedlytics.service.feedback.dto.response.RollingFeedbackTrend
import com.feedlytics.service.feedback.dto.response.SentimentCounts
import com.feedlytics.service.feedback.entity.FeedbacksEntity
import com.feedlytics.service.feedback.entity.enums.SentimentsEnum
import com.feedlytics.service.feedback.repository.FeedbackAiAnalysisRepository
import com.feedlytics.service.feedback.repository.FeedbackCategoriesRepository
import com.feedlytics.service.feedback.repository.FeedbacksRepository
import com.feedlytics.service.feedback.service.FeedbacksService
import com.feedlytics.service.workspace.entity.WorkspacesEntity
import com.feedlytics.service.workspace.entity.enums.WorkspaceRoleEnum
import com.feedlytics.service.workspace.repository.WorkspaceMembersRepository
import com.feedlytics.service.workspace.repository.WorkspaceRepository
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.time.ZoneOffset
import java.time.temporal.ChronoUnit
import java.util.UUID

@Service
class FeedbacksServiceImpl(
    private val feedbacksRepository: FeedbacksRepository,
    private val feedbackAiAnalysisRepository: FeedbackAiAnalysisRepository,
    private val feedbackCategoriesRepository: FeedbackCategoriesRepository,
    private val workspaceRepository: WorkspaceRepository,
    private val workspaceMembersRepository: WorkspaceMembersRepository,
) : FeedbacksService {

    @Transactional(readOnly = true)
    override fun getFeedbacksCountAndAvgRatings(workspaceId: Long): FeedbacksCountAndAvgRatingsResponse {
        val feedbackStats = feedbacksRepository.getFeedbacksCountAndAvgRatings(workspaceId)
        return FeedbacksCountAndAvgRatingsResponse(
            publicId = feedbackStats.publicId,
            totalFeedbacks = feedbackStats.totalFeedbacks,
            averageRating = feedbackStats.averageRating,
        )
    }

    @Transactional(readOnly = true)
    override fun getAllFeedbacksByWorkspaceId(workspaceId: Long): List<FeedbacksEntity> {
        return feedbacksRepository.findAllByWorkspaceId(workspaceId)
    }

    @Transactional(readOnly = true)
    override fun getFeedbacksOverviewAnalytics(workspaceId: Long): FeedbackOverviewAnalyticsResponse {
        val baseOverview = feedbacksRepository.getFeedbacksOverviewAnalytics(workspaceId)
            ?: throw NotFoundException("WORKSPACE_NOT_FOUND", "Workspace not found")
        val sentimentCounts = getSentimentCounts(workspaceId)
        val categories = getCategoryAnalytics(workspaceId)
        val rolling30DayFeedbacks = getRolling30DayFeedbacks(workspaceId)
        return FeedbackOverviewAnalyticsResponse(
            publicId = baseOverview.publicId,
            totalFeedbacks = baseOverview.totalFeedbacks,
            averageRating = baseOverview.averageRating ?: 0.0,
            topCategory = resolveTopCategory(categories),
            positiveSentimentPercentage = resolvePositiveSentimentPercentage(sentimentCounts),
            sentimentCounts = sentimentCounts,
            categories = categories,
            rolling30DayFeedbacks = rolling30DayFeedbacks,
        )
    }

    @Transactional(readOnly = true)
    override fun listFeedbacksForMember(
        workspacePublicId: UUID,
        userId: Long,
        page: Int,
        size: Int,
    ): FeedbacksListResponse {
        val workspace = resolveWorkspaceForMember(workspacePublicId, userId)
        val safePage = page.coerceAtLeast(0)
        val safeSize = size.coerceIn(1, 100)
        val pageable = PageRequest.of(
            safePage,
            safeSize,
            Sort.by(Sort.Direction.DESC, "createdAt"),
        )
        val pagedFeedbacks = feedbacksRepository.findAllByWorkspaceId(workspace.id, pageable)
        val feedbackIds = pagedFeedbacks.content.map { it.id }
        val sentimentByFeedbackId: Map<Long, SentimentsEnum> =
            if (feedbackIds.isEmpty()) {
                emptyMap()
            } else {
                feedbackAiAnalysisRepository
                    .findAllByFeedbackIdIn(feedbackIds)
                    .associate { it.feedbackId to it.sentiment }
            }
        return FeedbacksListResponse(
            feedbacks = pagedFeedbacks.content.map { entity ->
                entity.toItemResponse(sentiment = sentimentByFeedbackId[entity.id])
            },
            page = safePage,
            size = safeSize,
            totalElements = pagedFeedbacks.totalElements,
            totalPages = pagedFeedbacks.totalPages,
        )
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

    private fun getSentimentCounts(workspaceId: Long): SentimentCounts {
        val sentimentRows = feedbackAiAnalysisRepository.getSentimentCountsByWorkspaceId(workspaceId)
        var positive = 0L
        var negative = 0L
        var neutral = 0L

        sentimentRows.forEach { row ->
            val count = row.count ?: 0L
            when (row.sentiment) {
                SentimentsEnum.POSITIVE.name -> positive = count
                SentimentsEnum.NEGATIVE.name -> negative = count
                SentimentsEnum.NEUTRAL.name -> neutral = count
            }
        }

        return SentimentCounts(
            positive = positive,
            negative = negative,
            neutral = neutral,
        )
    }

    private fun getCategoryAnalytics(workspaceId: Long): CategoryAnalyticsBreakdown {
        val categoryCount = feedbackCategoriesRepository.countByWorkspaceId(workspaceId)
        if (categoryCount == 0L) {
            return CategoryAnalyticsBreakdown.notConfigured(FeedbackOverviewAnalyticsResponse.NO_CATEGORIES_MESSAGE)
        }

        val categoryItems = feedbacksRepository
            .getCategoryFeedbackCountsByWorkspaceId(workspaceId)
            .map { row ->
                CategoryAnalyticsItem(
                    id = row.categoryId,
                    name = row.categoryName,
                    feedbackCount = row.feedbackCount ?: 0L,
                )
            }
        val otherCount = feedbacksRepository.getOtherFeedbackCountByWorkspaceId(workspaceId)

        return CategoryAnalyticsBreakdown.ready(
            items = categoryItems,
            otherCount = otherCount,
        )
    }

    private fun resolveTopCategory(categories: CategoryAnalyticsBreakdown): String {
        if (categories.items.isNullOrEmpty()) return "NONE"
        val topCategory = categories.items.maxByOrNull { it.feedbackCount } ?: return "NONE"
        return if (topCategory.feedbackCount > 0L) topCategory.name else "NONE"
    }

    private fun resolvePositiveSentimentPercentage(sentimentCounts: SentimentCounts): Double {
        val analyzedTotal = sentimentCounts.positive + sentimentCounts.negative + sentimentCounts.neutral
        if (analyzedTotal == 0L) return 0.0
        return (100.0 * sentimentCounts.positive) / analyzedTotal
    }

    private fun getRolling30DayFeedbacks(workspaceId: Long, now: Instant = Instant.now()): RollingFeedbackTrend {
        val currentPeriodStart = now.minus(ROLLING_WINDOW_DAYS, ChronoUnit.DAYS)
        val previousPeriodStart = now.minus(ROLLING_WINDOW_DAYS * 2, ChronoUnit.DAYS)
        val previousPeriodEnd = currentPeriodStart

        val count = feedbacksRepository.countFeedbacksInRange(workspaceId, currentPeriodStart, now)
        val previousPeriodCount =
            feedbacksRepository.countFeedbacksInRange(workspaceId, previousPeriodStart, previousPeriodEnd)
        val changePercent = resolveChangePercent(count, previousPeriodCount)

        val countsByDay = feedbacksRepository
            .countFeedbacksByDay(workspaceId, currentPeriodStart, now)
            .associate { row -> row.day to (row.feedbackCount ?: 0L) }

        val periodStartDate = currentPeriodStart.atZone(ZoneOffset.UTC).toLocalDate()
        val dailyCounts = (0 until ROLLING_WINDOW_DAYS).map { offset ->
            val date = periodStartDate.plusDays(offset.toLong())
            DailyFeedbackCount(
                date = date.toString(),
                count = countsByDay[date] ?: 0L,
            )
        }

        return RollingFeedbackTrend(
            count = count,
            previousPeriodCount = previousPeriodCount,
            changePercent = changePercent,
            dailyCounts = dailyCounts,
        )
    }

    private fun resolveChangePercent(currentCount: Long, previousCount: Long): Double {
        if (previousCount == 0L) return 0.0
        return 100.0 * (currentCount - previousCount).toDouble() / previousCount.toDouble()
    }

    companion object {
        private const val ROLLING_WINDOW_DAYS = 30L
    }

    private fun FeedbacksEntity.toItemResponse(sentiment: SentimentsEnum?): FeedbackItemResponse =
        FeedbackItemResponse(
            publicId = publicId,
            sourceType = sourceType,
            content = content,
            rating = rating,
            submitterName = submitterName,
            submitterEmail = submitterEmail,
            sentiment = sentiment,
            createdAt = createdAt,
            updatedAt = updatedAt,
        )
}
