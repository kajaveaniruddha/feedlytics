package com.feedlytics.service.workspace.dto.request

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class CreateWorkspaceRequest(
    @field:NotBlank(message = "Name is required")
    @field:Size(max = 50, message = "Name must be less than 50 characters")
    val name: String,

    @field:Size(max = 500, message = "Description must be less than 500 characters")
    val description: String? = null
)
