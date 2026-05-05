package com.feedlytics.service.feedback.entity

import com.feedlytics.service.common.entity.BasePublicEntity
import com.feedlytics.service.feedback.entity.enums.SourceTypeEnum
import jakarta.persistence.*

@Entity
@Table(name = "feedbacks")
class FeedbacksEntity(
    @Column(name = "workspace_id", nullable = false)
    val workspaceId: Long,

    @Enumerated(EnumType.STRING)
    @Column(name="source_type", nullable = false)
    val sourceType: SourceTypeEnum,

    @Column(nullable = false)
    val content: String,

    @Column(nullable=false)
    val rating: Int

) : BasePublicEntity()
