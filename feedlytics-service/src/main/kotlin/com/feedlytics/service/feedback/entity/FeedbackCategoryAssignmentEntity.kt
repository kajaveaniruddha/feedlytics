package com.feedlytics.service.feedback.entity

import com.feedlytics.service.common.entity.BaseEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Table
import jakarta.persistence.UniqueConstraint

@Entity
@Table(
    name = "feedback_category_assignments",
    uniqueConstraints = [
        UniqueConstraint(name = "uq_feedback_category_assignments_feedback_category", columnNames = ["feedback_id", "category_id"]),
    ],
)
class FeedbackCategoryAssignmentEntity(

    @Column(name = "feedback_id", nullable = false)
    val feedbackId: Long,

    @Column(name = "category_id", nullable = false)
    val categoryId: Long,

    @Column(name = "feedback_ai_analysis_id")
    val feedbackAiAnalysisId: Long? = null,

    @Column(name = "confidence")
    val confidence: Double? = null,
) : BaseEntity()
