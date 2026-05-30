package com.feedlytics.service.feedback.entity

import com.feedlytics.service.common.entity.BaseEntity
import com.feedlytics.service.feedback.entity.enums.SentimentsEnum
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.Table
import java.time.Instant

@Entity
@Table(name = "feedback_ai_analysis")
class FeedbackAiAnalysis(

    @Column(name="feedback_id", nullable=false)
    val feedbackId: Long,

    @Column(name="sentiment")
    @Enumerated(EnumType.STRING)
    val sentiment: SentimentsEnum,

    @Column(name="confidence")
    val confidence: Double,

    @Column(name="processed_at")
    val processedAt: Instant = Instant.now()
): BaseEntity()
