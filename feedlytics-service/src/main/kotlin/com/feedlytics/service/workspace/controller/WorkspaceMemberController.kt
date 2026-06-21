package com.feedlytics.service.workspace.controller

import com.feedlytics.service.common.security.AuthenticatedUser
import com.feedlytics.service.workspace.dto.request.UpdateMemberRoleRequest
import com.feedlytics.service.workspace.dto.response.MemberListResponse
import com.feedlytics.service.workspace.dto.response.MemberResponse
import com.feedlytics.service.workspace.service.WorkspaceMemberService
import jakarta.validation.Valid
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/v1/workspaces/{workspaceId}/members")
class WorkspaceMemberController(
    private val workspaceMemberService: WorkspaceMemberService
) {

    private val log = LoggerFactory.getLogger(WorkspaceMemberController::class.java)

    @GetMapping
    fun getMembers(
        @AuthenticationPrincipal user: AuthenticatedUser,
        @PathVariable workspaceId: UUID
    ): MemberListResponse {
        log.info("workspaceMembers list workspaceId={} userId={}", workspaceId, user.id)
        return workspaceMemberService.getMembers(workspaceId, user.id)
    }

    @PutMapping("/{memberUserPublicId}")
    fun updateMemberRole(
        @AuthenticationPrincipal user: AuthenticatedUser,
        @PathVariable workspaceId: UUID,
        @PathVariable memberUserPublicId: UUID,
        @Valid @RequestBody request: UpdateMemberRoleRequest
    ): MemberResponse {
        log.info(
            "workspaceMembers updateRole workspaceId={} memberUserPublicId={} actorUserId={}",
            workspaceId,
            memberUserPublicId,
            user.id,
        )
        return workspaceMemberService.updateMemberRole(workspaceId, memberUserPublicId, request, user.id)
    }

    @DeleteMapping("/{memberUserPublicId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun removeMember(
        @AuthenticationPrincipal user: AuthenticatedUser,
        @PathVariable workspaceId: UUID,
        @PathVariable memberUserPublicId: UUID
    ) {
        log.info(
            "workspaceMembers remove workspaceId={} memberUserPublicId={} actorUserId={}",
            workspaceId,
            memberUserPublicId,
            user.id,
        )
        workspaceMemberService.removeMember(workspaceId, memberUserPublicId, user.id)
    }

    @PostMapping("/leave")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun leaveWorkspace(
        @AuthenticationPrincipal user: AuthenticatedUser,
        @PathVariable workspaceId: UUID
    ) {
        log.info("workspaceMembers leave workspaceId={} userId={}", workspaceId, user.id)
        workspaceMemberService.leaveWorkspace(workspaceId, user.id)
    }
}
