package com.feedlytics.service.workspace.dto.request

import jakarta.validation.constraints.Size

data class UpdateWidgetOriginsRequest(
    /** Empty list clears allowed origins. */
    @field:Size(max = 32, message = "At most 32 origins are allowed")
    val origins: List<String> = emptyList(),
)
