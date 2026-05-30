package com.feedlytics.service.widget.repository

import com.feedlytics.service.widget.entity.WidgetEntity
import org.springframework.data.jpa.repository.JpaRepository

interface WidgetRepository : JpaRepository<WidgetEntity, Long> {
    fun findByWorkspaceId(workspaceId: Long): WidgetEntity?
}
