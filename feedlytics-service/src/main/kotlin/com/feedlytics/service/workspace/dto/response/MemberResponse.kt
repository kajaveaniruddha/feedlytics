package com.feedlytics.service.workspace.dto.response

import com.feedlytics.service.workspace.entity.enums.MemberStatusEnum
import com.feedlytics.service.workspace.entity.enums.WorkspaceRoleEnum
import java.time.Instant
import java.util.UUID

data class MemberListResponse(
    val success: Boolean = true,
    val members: List<MemberData>,
    val pendingInvites: List<InviteData> = emptyList()
)

data class MemberResponse(
    val success: Boolean = true,
    val message: String? = null,
    val member: MemberData
)

data class MemberData(
    val userPublicId: UUID,
    val name: String,
    val email: String,
    val avatarUrl: String?,
    val role: WorkspaceRoleEnum,
    val status: MemberStatusEnum,
    val joinedAt: Instant
)

data class InviteData(
    val invitePublicId: UUID,
    val email: String,
    val role: WorkspaceRoleEnum,
    val status: String,
    val expiresAt: Instant,
    val createdAt: Instant,
    val token: String? = null  // Only included when invite is created (for testing)
)
