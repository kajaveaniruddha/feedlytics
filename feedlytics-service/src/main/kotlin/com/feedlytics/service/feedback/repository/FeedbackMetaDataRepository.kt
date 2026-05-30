package com.feedlytics.service.feedback.repository

import com.feedlytics.service.feedback.entity.FeedbackMetaDataEntity
import org.springframework.data.jpa.repository.JpaRepository

interface FeedbackMetaDataRepository : JpaRepository<FeedbackMetaDataEntity, Long>
