package com.feedlytics.service.workspace.dto.request

import com.feedlytics.service.workspace.entity.enums.WorkspaceRoleEnum
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

data class InviteMemberRequest(
    @field:NotBlank(message = "Email is required")
    @field:Email(message = "Invalid email format")
    val email: String,

    @field:NotNull(message = "Role is required")
    @field:Enumerated(EnumType.STRING)
    val role: WorkspaceRoleEnum
)

data class UpdateMemberRoleRequest(
    @field:NotNull(message = "Role is required")
    @field:Enumerated(EnumType.STRING)
    val role: WorkspaceRoleEnum
)
