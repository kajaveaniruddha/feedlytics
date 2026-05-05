package com.feedlytics.service.workspace.dto.response

import com.feedlytics.service.workspace.dto.WorkspaceWithRoleDto
import com.feedlytics.service.workspace.entity.enums.MemberStatusEnum
import com.feedlytics.service.workspace.entity.enums.PlansEnum
import com.feedlytics.service.workspace.entity.enums.WorkspaceRoleEnum
import java.time.Instant
import java.util.UUID

data class WorkspaceResponse(
    val success: Boolean = true,
    val message: String? = null,
    val workspace: WorkspaceData
)

data class WorkspaceListResponse(
    val success: Boolean = true,
    val workspaces: List<WorkspaceData>
)

data class WorkspaceData(
    val publicId: UUID,
    val name: String,
    val description: String?,
    val plan: PlansEnum,
    val role: WorkspaceRoleEnum,
    val status: MemberStatusEnum,
    val memberCount: Long,
    val feedbackCount: Long,
    val avgRating: Double?,
    val createdAt: Instant
)
