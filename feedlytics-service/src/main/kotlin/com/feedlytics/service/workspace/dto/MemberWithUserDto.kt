package com.feedlytics.service.workspace.dto

import com.feedlytics.service.workspace.entity.enums.MemberStatusEnum
import com.feedlytics.service.workspace.entity.enums.WorkspaceRoleEnum
import java.time.Instant
import java.util.UUID

data class MemberWithUserDto(
    val memberId: Long,
    val userPublicId: UUID,
    val userName: String,
    val userEmail: String,
    val userAvatarUrl: String?,
    val role: WorkspaceRoleEnum,
    val status: MemberStatusEnum,
    val joinedAt: Instant
)
