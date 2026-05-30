package com.feedlytics.service.feedback.repository

import com.feedlytics.service.feedback.dto.response.FeedbacksCountAndAvgRatingsResponse
import com.feedlytics.service.feedback.entity.FeedbacksEntity
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.time.Instant
import java.time.LocalDate
import java.util.UUID

interface FeedbacksRepository: JpaRepository<FeedbacksEntity, Long> {
    fun findByPublicId(publicId: UUID): FeedbacksEntity?
    fun findAllByWorkspaceId(workspaceId: Long): List<FeedbacksEntity>
    fun findAllByWorkspaceId(workspaceId: Long, pageable: Pageable): Page<FeedbacksEntity>

    @Query(
        value = """
        SELECT w.public_id AS publicId,
               CAST((SELECT COUNT(*) FROM feedbacks f WHERE f.workspace_id = :workspaceId) AS bigint) AS totalFeedbacks,
               CAST(COALESCE((SELECT AVG(f.rating) FROM feedbacks f WHERE f.workspace_id = :workspaceId), 0) AS double precision) AS averageRating
        FROM workspaces w
        WHERE w.id = :workspaceId
    """,
        nativeQuery = true
    )
    fun getFeedbacksOverviewAnalytics(@Param("workspaceId") workspaceId: Long): FeedbackOverviewAnalyticsRow?

    @Query(
        value = """
        SELECT fc.id AS categoryId,
               fc.name AS categoryName,
               CAST(COUNT(DISTINCT f.id) AS bigint) AS feedbackCount
        FROM feedbacks_categories fc
        LEFT JOIN feedback_category_assignments fca ON fc.id = fca.category_id
        LEFT JOIN feedbacks f ON fca.feedback_id = f.id AND f.workspace_id = :workspaceId
        WHERE fc.workspace_id = :workspaceId
        GROUP BY fc.id, fc.name
        ORDER BY fc.name ASC
        """,
        nativeQuery = true,
    )
    fun getCategoryFeedbackCountsByWorkspaceId(@Param("workspaceId") workspaceId: Long): List<CategoryFeedbackCountRow>

    @Query(
        value = """
        SELECT CAST(COUNT(*) AS bigint)
        FROM feedbacks f
        WHERE f.workspace_id = :workspaceId
          AND NOT EXISTS (
              SELECT 1
              FROM feedback_category_assignments fca
              WHERE fca.feedback_id = f.id
          )
        """,
        nativeQuery = true,
    )
    fun getOtherFeedbackCountByWorkspaceId(@Param("workspaceId") workspaceId: Long): Long

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

    @Query(
        value = """
        SELECT f.source_type AS sourceType,
               CAST(COUNT(*) AS bigint) AS usedCount
        FROM feedbacks f
        WHERE f.workspace_id = :workspaceId
          AND f.created_at >= :periodStart
          AND f.created_at < :periodEnd
        GROUP BY f.source_type
        """,
        nativeQuery = true,
    )
    fun getFeedbackUsageBySourceType(
        @Param("workspaceId") workspaceId: Long,
        @Param("periodStart") periodStart: Instant,
        @Param("periodEnd") periodEnd: Instant,
    ): List<FeedbackUsageBySourceTypeRow>

    @Query(
        value = """
        SELECT CAST(COUNT(*) AS bigint)
        FROM feedbacks f
        WHERE f.workspace_id = :workspaceId
          AND f.created_at >= :periodStart
          AND f.created_at < :periodEnd
        """,
        nativeQuery = true,
    )
    fun countFeedbacksInRange(
        @Param("workspaceId") workspaceId: Long,
        @Param("periodStart") periodStart: Instant,
        @Param("periodEnd") periodEnd: Instant,
    ): Long

    @Query(
        value = """
        SELECT CAST(f.created_at AT TIME ZONE 'UTC' AS date) AS day,
               CAST(COUNT(*) AS bigint) AS feedbackCount
        FROM feedbacks f
        WHERE f.workspace_id = :workspaceId
          AND f.created_at >= :periodStart
          AND f.created_at < :periodEnd
        GROUP BY day
        ORDER BY day ASC
        """,
        nativeQuery = true,
    )
    fun countFeedbacksByDay(
        @Param("workspaceId") workspaceId: Long,
        @Param("periodStart") periodStart: Instant,
        @Param("periodEnd") periodEnd: Instant,
    ): List<FeedbackCountByDayRow>

    interface FeedbackOverviewAnalyticsRow {
        val publicId: UUID
        val totalFeedbacks: Long
        val averageRating: Double?
    }

    interface CategoryFeedbackCountRow {
        val categoryId: Long
        val categoryName: String
        val feedbackCount: Long?
    }

    interface FeedbackUsageBySourceTypeRow {
        val sourceType: String
        val usedCount: Long?
    }

    interface FeedbackCountByDayRow {
        val day: LocalDate
        val feedbackCount: Long?
    }
}
