package com.feedlytics.service.feedback.entity

import com.feedlytics.service.common.entity.BasePublicEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Table

@Entity
@Table(name = "feedback_metadata")
class FeedbackMetaDataEntity(

    @Column(name = "feedback_id", nullable = false)
    val feedbackId: Long,

    @Column(name = "ip_address")
    val ipAddress: String? = null,

    @Column(name = "user_agent")
    val userAgent: String? = null,

    @Column(name = "location")
    val location: String? = null,

) : BasePublicEntity()
