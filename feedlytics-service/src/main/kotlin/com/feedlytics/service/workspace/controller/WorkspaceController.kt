package com.feedlytics.service.workspace.controller

import com.feedlytics.service.common.security.AuthenticatedUser
import com.feedlytics.service.workspace.dto.request.CreateWorkspaceRequest
import com.feedlytics.service.workspace.dto.request.TransferOwnershipRequest
import com.feedlytics.service.workspace.dto.request.UpdateWorkspaceRequest
import com.feedlytics.service.workspace.dto.response.WorkspaceListResponse
import com.feedlytics.service.workspace.dto.response.WorkspacePlanUsageResponse
import com.feedlytics.service.workspace.dto.response.WorkspaceResponse

import com.feedlytics.service.workspace.service.WorkspaceService
import jakarta.validation.Valid
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/v1/workspaces")
class WorkspaceController(
    private val workspaceService: WorkspaceService,
){
    private val log = LoggerFactory.getLogger(WorkspaceController::class.java)

    @GetMapping
    fun listWorkspaces(@AuthenticationPrincipal user: AuthenticatedUser): WorkspaceListResponse {
        log.info("workspaces list userId={}", user.id)
        return workspaceService.getWorkspacesForUser(user.id)
    }

    @PostMapping
    fun createWorkspace(
        @AuthenticationPrincipal user: AuthenticatedUser,
        @Valid @RequestBody request: CreateWorkspaceRequest,): WorkspaceResponse{
        log.info("workspaces create userId={}", user.id)
        return workspaceService.createWorkspace(request,user.id)
    }

    @GetMapping("/{workspaceId}")
    fun getWorkspace(
        @AuthenticationPrincipal user: AuthenticatedUser,
        @PathVariable workspaceId: UUID
    ): WorkspaceResponse {
        log.info("workspaces get workspaceId={} userId={}", workspaceId, user.id)
        return workspaceService.getWorkspace(workspaceId, user.id)
    }

    @GetMapping("/{workspaceId}/plan-usage")
    fun getWorkspacePlanUsage(
        @AuthenticationPrincipal user: AuthenticatedUser,
        @PathVariable workspaceId: UUID,
    ): WorkspacePlanUsageResponse {
        log.info("workspaces getPlanUsage workspaceId={} userId={}", workspaceId, user.id)
        return workspaceService.getWorkspacePlanUsage(workspaceId, user.id)
    }

    @PutMapping("/{workspaceId}")
    fun updateWorkspace(
        @AuthenticationPrincipal user: AuthenticatedUser,
        @PathVariable workspaceId: UUID,
        @Valid @RequestBody request: UpdateWorkspaceRequest
    ): WorkspaceResponse {
        log.info("workspaces update workspaceId={} userId={}", workspaceId, user.id)
        return workspaceService.updateWorkspace(workspaceId, request, user.id)
    }
    @DeleteMapping("/{workspaceId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteWorkspace(
        @AuthenticationPrincipal user: AuthenticatedUser,
        @PathVariable workspaceId: UUID
    ) {
        log.info("workspaces delete workspaceId={} userId={}", workspaceId, user.id)
        workspaceService.deleteWorkspace(workspaceId, user.id)
    }

    @PostMapping("/{workspaceId}/transfer-ownership")
    fun transferOwnership(
        @AuthenticationPrincipal user: AuthenticatedUser,
        @PathVariable workspaceId: UUID,
        @Valid @RequestBody request: TransferOwnershipRequest,
    ): WorkspaceResponse {
        log.info("workspaces transferOwnership workspaceId={} userId={}", workspaceId, user.id)
        return workspaceService.transferOwnership(workspaceId, request, user.id)
    }

}
