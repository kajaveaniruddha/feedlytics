package com.feedlytics.service.workspace.dto.request

import jakarta.validation.constraints.NotNull
import java.util.UUID

data class TransferOwnershipRequest(
    @field:NotNull(message = "New owner user id is required")
    val newOwnerUserPublicId: UUID,
)
