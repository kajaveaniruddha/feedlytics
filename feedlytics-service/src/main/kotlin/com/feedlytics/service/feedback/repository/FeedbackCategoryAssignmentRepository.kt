package com.feedlytics.service.feedback.repository

import com.feedlytics.service.feedback.entity.FeedbackCategoryAssignmentEntity
import org.springframework.data.jpa.repository.JpaRepository

interface FeedbackCategoryAssignmentRepository : JpaRepository<FeedbackCategoryAssignmentEntity, Long> {

    fun findAllByFeedbackId(feedbackId: Long): List<FeedbackCategoryAssignmentEntity>

    fun findAllByFeedbackAiAnalysisId(feedbackAiAnalysisId: Long): List<FeedbackCategoryAssignmentEntity>

    fun deleteByFeedbackId(feedbackId: Long)

    fun countByCategoryId(categoryId: Long): Long
}
