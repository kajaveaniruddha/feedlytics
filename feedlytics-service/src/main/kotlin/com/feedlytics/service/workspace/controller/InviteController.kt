package com.feedlytics.service.workspace.controller

import com.feedlytics.service.common.security.AuthenticatedUser
import com.feedlytics.service.workspace.dto.request.InviteMemberRequest
import com.feedlytics.service.workspace.dto.response.InviteData
import com.feedlytics.service.workspace.dto.response.MemberData
import com.feedlytics.service.workspace.dto.response.PendingInviteInfo
import com.feedlytics.service.workspace.service.InviteService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/v1")
class InviteController(
    private val inviteService: InviteService
) {

    @PostMapping("/workspaces/{workspaceId}/invites")
    @ResponseStatus(HttpStatus.CREATED)
    fun inviteMember(
        @AuthenticationPrincipal user: AuthenticatedUser,
        @PathVariable workspaceId: UUID,
        @Valid @RequestBody request: InviteMemberRequest
    ): InviteResponse {
        val invite = inviteService.inviteMember(workspaceId, request, user.id)
        return InviteResponse(
            success = true,
            message = "Invitation sent successfully.",
            invite = invite
        )
    }

    @DeleteMapping("/workspaces/{workspaceId}/invites/{inviteId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun cancelInvite(
        @AuthenticationPrincipal user: AuthenticatedUser,
        @PathVariable workspaceId: UUID,
        @PathVariable inviteId: UUID
    ) {
        inviteService.cancelInvite(workspaceId, inviteId, user.id)
    }

    @PostMapping("/workspaces/{workspaceId}/invites/{inviteId}/resend")
    fun resendInvite(
        @AuthenticationPrincipal user: AuthenticatedUser,
        @PathVariable workspaceId: UUID,
        @PathVariable inviteId: UUID
    ): InviteResponse {
        val invite = inviteService.resendInvite(workspaceId, inviteId, user.id)
        return InviteResponse(
            success = true,
            message = "Invitation resent successfully.",
            invite = invite
        )
    }

    @PostMapping("/invites/accept")
    fun acceptInvite(
        @AuthenticationPrincipal user: AuthenticatedUser,
        @RequestBody request: AcceptInviteRequest
    ): AcceptInviteResponse {
        val result = inviteService.acceptInvite(request.token, user.id)
        return AcceptInviteResponse(
            success = true,
            message = "You have joined ${result.workspaceName}.",
            workspacePublicId = result.workspacePublicId,
            workspaceName = result.workspaceName,
            member = result.member
        )
    }

    @GetMapping("/invites/pending")
    fun getMyPendingInvites(
        @AuthenticationPrincipal user: AuthenticatedUser
    ): PendingInvitesResponse {
        val invites = inviteService.getPendingInvitesForUser(user.email)
        return PendingInvitesResponse(
            success = true,
            invites = invites
        )
    }
}

data class InviteResponse(
    val success: Boolean,
    val message: String,
    val invite: InviteData
)

data class AcceptInviteRequest(
    val token: String
)

data class AcceptInviteResponse(
    val success: Boolean,
    val message: String,
    val workspacePublicId: UUID,
    val workspaceName: String,
    val member: MemberData
)

data class PendingInvitesResponse(
    val success: Boolean,
    val invites: List<PendingInviteInfo>
)
