package com.feedlytics.service.feedback.repository

import com.feedlytics.service.feedback.dto.response.FeedbackOverviewAnalyticsResponse
import com.feedlytics.service.feedback.dto.response.FeedbacksCountAndAvgRatingsResponse
import com.feedlytics.service.feedback.entity.FeedbacksEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.util.UUID

interface FeedbacksRepository: JpaRepository<FeedbacksEntity, Long> {
    fun findByPublicId(publicId: UUID): FeedbacksEntity?
    fun findAllByWorkspaceId(workspaceId: Long): List<FeedbacksEntity>

    @Query(
        value = """
        SELECT w.public_id AS publicId,
               CAST((SELECT COUNT(*) FROM feedbacks f WHERE f.workspace_id = :workspaceId) AS bigint) AS totalFeedbacks,
               CAST(COALESCE((SELECT AVG(f.rating) FROM feedbacks f WHERE f.workspace_id = :workspaceId), 0) AS double precision) AS averageRating,
               COALESCE(
                   (SELECT f2.source_type::text FROM feedbacks f2
                    WHERE f2.workspace_id = :workspaceId
                    GROUP BY f2.source_type
                    ORDER BY COUNT(*) DESC
                    LIMIT 1),
                   'NONE'
               ) AS topCategory,
               CAST(COALESCE(
                   (SELECT 100.0 * COUNT(*) FILTER (WHERE fa.sentiment = 'POSITIVE') / NULLIF(COUNT(*), 0)
                    FROM feedback_ai_analysis fa
                    INNER JOIN feedbacks fb ON fa.feedback_id = fb.id
                    WHERE fb.workspace_id = :workspaceId),
                   0.0
               ) AS double precision) AS positiveSentimentPercentage
        FROM workspaces w
        WHERE w.id = :workspaceId
    """,
        nativeQuery = true
    )
    fun getFeedbacksOverviewAnalytics(@Param("workspaceId") workspaceId: Long): FeedbackOverviewAnalyticsResponse?

    @Query(
        value = """
            SELECT w.public_id AS publicId,
               CAST((SELECT COUNT(*) FROM feedbacks f WHERE f.workspace_id = :workspaceId) AS bigint) AS totalFeedbacks,
               CAST(COALESCE((SELECT AVG(f.rating) FROM feedbacks f WHERE f.workspace_id = :workspaceId), 0) AS double precision) AS averageRating
        FROM workspaces w
        WHERE w.id = :workspaceId
        """,
        nativeQuery = true,
    )
    fun getFeedbacksCountAndAvgRatings(@Param("workspaceId") workspaceId: Long): FeedbacksCountAndAvgRatingsResponse
}
