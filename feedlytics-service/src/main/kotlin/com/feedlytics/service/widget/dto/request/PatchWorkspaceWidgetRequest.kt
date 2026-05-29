package com.feedlytics.service.widget.dto.request

import com.feedlytics.service.widget.entity.WidgetThemeJson

data class PatchWorkspaceWidgetRequest(
    val collectName: Boolean? = null,
    val collectEmail: Boolean? = null,
    val isActive: Boolean? = null,
    /** When present, replaces the entire theme document after validation. */
    val theme: WidgetThemeJson? = null,
)
