package com.feedlytics.service.feedback.service

import com.feedlytics.service.feedback.dto.response.FeedbackItemResponse
import com.feedlytics.service.feedback.dto.response.FeedbackOverviewAnalyticsResponse
import com.feedlytics.service.feedback.dto.response.FeedbacksCountAndAvgRatingsResponse
import com.feedlytics.service.feedback.entity.FeedbacksEntity
import java.util.UUID

interface FeedbacksService {
    fun getFeedbacksCountAndAvgRatings(workspaceId: Long): FeedbacksCountAndAvgRatingsResponse
    fun getAllFeedbacksByWorkspaceId(workspaceId: Long): List<FeedbacksEntity>
    fun getFeedbacksOverviewAnalytics(workspaceId: Long): FeedbackOverviewAnalyticsResponse

    fun listFeedbacksForMember(workspacePublicId: UUID, userId: Long): List<FeedbackItemResponse>
    fun getMetricsForMember(workspacePublicId: UUID, userId: Long): FeedbacksCountAndAvgRatingsResponse
    fun getOverviewAnalyticsForMember(workspacePublicId: UUID, userId: Long): FeedbackOverviewAnalyticsResponse
    fun deleteFeedbackForMember(workspacePublicId: UUID, feedbackPublicId: UUID, userId: Long)
}
