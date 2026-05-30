package com.feedlytics.service.widget.dto.response

import com.feedlytics.service.widget.entity.WidgetThemeJson
import java.time.Instant

data class WorkspaceWidgetResponse(
    val collectName: Boolean,
    val collectEmail: Boolean,
    val theme: WidgetThemeJson,
    val isActive: Boolean,
    val createdAt: Instant,
    val updatedAt: Instant,
)
