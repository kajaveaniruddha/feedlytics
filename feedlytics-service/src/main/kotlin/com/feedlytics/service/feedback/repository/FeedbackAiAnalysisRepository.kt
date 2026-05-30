package com.feedlytics.service.feedback.repository

import com.feedlytics.service.feedback.entity.FeedbackAiAnalysis
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface FeedbackAiAnalysisRepository : JpaRepository<FeedbackAiAnalysis, Long> {
    fun findByFeedbackId(feedbackId: Long): FeedbackAiAnalysis?

    fun findAllByFeedbackIdIn(feedbackIds: Collection<Long>): List<FeedbackAiAnalysis>

    @Query(
        value = """
        SELECT fa.sentiment AS sentiment,
               CAST(COUNT(*) AS bigint) AS count
        FROM feedback_ai_analysis fa
        INNER JOIN feedbacks f ON fa.feedback_id = f.id
        WHERE f.workspace_id = :workspaceId
        GROUP BY fa.sentiment
        """,
        nativeQuery = true,
    )
    fun getSentimentCountsByWorkspaceId(@Param("workspaceId") workspaceId: Long): List<SentimentCountRow>

    interface SentimentCountRow {
        val sentiment: String?
        val count: Long?
    }
}
