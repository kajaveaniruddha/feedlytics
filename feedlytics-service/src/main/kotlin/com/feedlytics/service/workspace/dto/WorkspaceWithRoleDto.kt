package com.feedlytics.service.workspace.dto

import com.feedlytics.service.workspace.entity.enums.MemberStatusEnum
import com.feedlytics.service.workspace.entity.enums.PlansEnum
import com.feedlytics.service.workspace.entity.enums.WorkspaceRoleEnum
import java.time.Instant
import java.util.UUID

data class WorkspaceWithRoleDto(
    val workspaceId: Long,
    val publicId: UUID,
    val name: String,
    val description: String?,
    val plan: PlansEnum,
    val ownerId: Long,
    val createdAt: Instant,
    val role: WorkspaceRoleEnum,
    val status: MemberStatusEnum,
    val memberCount: Long,
    val avgRating: Double,
    val feedbackCount: Long
)
