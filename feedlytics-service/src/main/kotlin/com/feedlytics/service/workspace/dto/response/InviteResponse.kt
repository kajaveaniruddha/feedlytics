package com.feedlytics.service.workspace.dto.response

import java.time.Instant
import java.util.UUID

data class AcceptInviteResult(
    val workspacePublicId: UUID,
    val workspaceName: String,
    val member: MemberData
)

data class PendingInviteInfo(
    val inviteId: UUID,
    val workspacePublicId: UUID,
    val workspaceName: String,
    val role: String,
    val invitedAt: Instant,
    val expiresAt: Instant
)
