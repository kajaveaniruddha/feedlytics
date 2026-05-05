package com.feedlytics.service.feedback.repository

import com.feedlytics.service.feedback.entity.FeedbackAiAnalysis
import org.springframework.data.jpa.repository.JpaRepository

interface FeedbackAiAnalysisRepository : JpaRepository<FeedbackAiAnalysis, Long> {
    fun findByFeedbackId(feedbackId: Long): FeedbackAiAnalysis?
}
