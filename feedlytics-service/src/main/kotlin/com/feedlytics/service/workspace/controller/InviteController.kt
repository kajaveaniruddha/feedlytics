package com.feedlytics.service.workspace.controller

import com.feedlytics.service.common.security.AuthenticatedUser
import com.feedlytics.service.workspace.dto.request.InviteMemberRequest
import com.feedlytics.service.workspace.dto.response.InviteData
import com.feedlytics.service.workspace.dto.response.MemberData
import com.feedlytics.service.workspace.dto.response.PendingInviteInfo
import com.feedlytics.service.workspace.service.InviteService
import jakarta.validation.Valid
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/v1")
class InviteController(
    private val inviteService: InviteService
) {

    private val log = LoggerFactory.getLogger(InviteController::class.java)

    @PostMapping("/workspaces/{workspaceId}/invites")
    @ResponseStatus(HttpStatus.CREATED)
    fun inviteMember(
        @AuthenticationPrincipal user: AuthenticatedUser,
        @PathVariable workspaceId: UUID,
        @Valid @RequestBody request: InviteMemberRequest
    ): InviteResponse {
        log.info("invites create workspaceId={} inviterUserId={}", workspaceId, user.id)
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
        log.info("invites cancel workspaceId={} inviteId={} userId={}", workspaceId, inviteId, user.id)
        inviteService.cancelInvite(workspaceId, inviteId, user.id)
    }

    @PostMapping("/workspaces/{workspaceId}/invites/{inviteId}/resend")
    fun resendInvite(
        @AuthenticationPrincipal user: AuthenticatedUser,
        @PathVariable workspaceId: UUID,
        @PathVariable inviteId: UUID
    ): InviteResponse {
        log.info("invites resend workspaceId={} inviteId={} userId={}", workspaceId, inviteId, user.id)
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
        log.info("invites acceptInvite userId={}", user.id)
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
        log.info("invites listPending userId={}", user.id)
        val invites = inviteService.getPendingInvitesForUser(user.email)
        return PendingInvitesResponse(
            success = true,
            invites = invites
        )
    }

    @PostMapping("/invites/pending/{inviteId}/accept")
    fun acceptPendingInvite(
        @AuthenticationPrincipal user: AuthenticatedUser,
        @PathVariable inviteId: UUID,
    ): AcceptInviteResponse {
        log.info("invites acceptPending inviteId={} userId={}", inviteId, user.id)
        val result = inviteService.acceptPendingInviteById(inviteId, user.id)
        return AcceptInviteResponse(
            success = true,
            message = "You have joined ${result.workspaceName}.",
            workspacePublicId = result.workspacePublicId,
            workspaceName = result.workspaceName,
            member = result.member
        )
    }

    @PostMapping("/invites/pending/{inviteId}/reject")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun rejectPendingInvite(
        @AuthenticationPrincipal user: AuthenticatedUser,
        @PathVariable inviteId: UUID,
    ) {
        log.info("invites rejectPending inviteId={} userId={}", inviteId, user.id)
        inviteService.rejectPendingInviteById(inviteId, user.id)
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
