package com.feedlytics.service.feedback.repository

import com.feedlytics.service.workspace.entity.FeedbackCategoriesEntity
import org.springframework.data.jpa.repository.JpaRepository

interface FeedbackCategoriesRepository : JpaRepository<FeedbackCategoriesEntity, Long> {
    fun findAllByWorkspaceIdOrderByNameAsc(workspaceId: Long): List<FeedbackCategoriesEntity>

    fun countByWorkspaceId(workspaceId: Long): Long

    fun findByWorkspaceIdAndNameIgnoreCase(workspaceId: Long, name: String): FeedbackCategoriesEntity?
}
