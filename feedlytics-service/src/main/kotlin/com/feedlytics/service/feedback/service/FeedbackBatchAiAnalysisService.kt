package com.feedlytics.service.feedback.service

import com.feedlytics.service.feedback.dto.request.BatchAiAnalysisItemRequest
import com.feedlytics.service.feedback.entity.FeedbackAiAnalysis
import com.feedlytics.service.feedback.entity.FeedbackCategoryAssignmentEntity
import com.feedlytics.service.feedback.entity.enums.SentimentsEnum
import com.feedlytics.service.feedback.repository.FeedbackAiAnalysisRepository
import com.feedlytics.service.feedback.repository.FeedbackCategoriesRepository
import com.feedlytics.service.feedback.repository.FeedbackCategoryAssignmentRepository
import com.feedlytics.service.feedback.repository.FeedbacksRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class FeedbackBatchAiAnalysisService(
    private val feedbacksRepository: FeedbacksRepository,
    private val feedbackAiAnalysisRepository: FeedbackAiAnalysisRepository,
    private val feedbackCategoriesRepository: FeedbackCategoriesRepository,
    private val feedbackCategoryAssignmentRepository: FeedbackCategoryAssignmentRepository,
) {

    @Transactional
    fun persistBatch(items: List<BatchAiAnalysisItemRequest>) {
        for (item in items) {
            if (feedbackAiAnalysisRepository.findByFeedbackId(item.feedbackId) != null) {
                continue
            }
            val feedback = feedbacksRepository.findById(item.feedbackId).orElse(null) ?: continue

            val sentiment = parseSentiment(item.sentiment)
            val confidence = item.overallConfidence.coerceIn(0.0, 1.0)

            val analysis = FeedbackAiAnalysis(
                feedbackId = item.feedbackId,
                sentiment = sentiment,
                confidence = confidence,
            )
            val savedAnalysis = feedbackAiAnalysisRepository.save(analysis)

            for (c in item.categories) {
                val name = c.categoryName.trim()
                if (name.isEmpty()) continue
                val category = feedbackCategoriesRepository.findByWorkspaceIdAndNameIgnoreCase(
                    feedback.workspaceId,
                    name,
                ) ?: continue

                val assignment = FeedbackCategoryAssignmentEntity(
                    feedbackId = feedback.id,
                    categoryId = category.id,
                    feedbackAiAnalysisId = savedAnalysis.id,
                    confidence = c.confidence,
                )
                feedbackCategoryAssignmentRepository.save(assignment)
            }
        }
    }

    private fun parseSentiment(raw: String): SentimentsEnum =
        when (raw.trim().lowercase()) {
            "positive" -> SentimentsEnum.POSITIVE
            "negative" -> SentimentsEnum.NEGATIVE
            else -> SentimentsEnum.NEUTRAL
        }
}
