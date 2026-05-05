package com.feedlytics.service.workspace.dto.request

import jakarta.validation.constraints.Size

data class UpdateWorkspaceRequest(
    @field:Size(max = 50, message = "Name must be less than 50 characters")
    val name: String? = null,

    @field:Size(max = 500, message = "Description must be less than 500 characters")
    val description: String? = null
)
