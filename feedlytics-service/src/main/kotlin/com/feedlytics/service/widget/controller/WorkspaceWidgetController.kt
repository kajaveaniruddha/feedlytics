package com.feedlytics.service.widget.controller

import com.feedlytics.service.common.security.AuthenticatedUser
import com.feedlytics.service.widget.dto.request.PatchWorkspaceWidgetRequest
import com.feedlytics.service.widget.dto.response.WorkspaceWidgetResponse
import com.feedlytics.service.widget.service.WorkspaceWidgetService
import jakarta.validation.Valid
import org.slf4j.LoggerFactory
import org.springframework.http.HttpHeaders
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/v1/workspaces/{workspacePublicId}")
class WorkspaceWidgetController(
    private val workspaceWidgetService: WorkspaceWidgetService,
) {

    private val log = LoggerFactory.getLogger(WorkspaceWidgetController::class.java)

    @GetMapping("/widget")
    fun getPublicWidgetConfig(
        @PathVariable workspacePublicId: UUID,
        @RequestHeader(value = HttpHeaders.ORIGIN, required = false) origin: String?,
    ): WorkspaceWidgetResponse {
        log.info("widget getPublicConfig workspacePublicId={}", workspacePublicId)
        return workspaceWidgetService.getPublicConfig(workspacePublicId, origin)
    }

    @GetMapping("/widget/management")
    fun getManagementWidgetConfig(
        @PathVariable workspacePublicId: UUID,
        @AuthenticationPrincipal user: AuthenticatedUser,
    ): WorkspaceWidgetResponse {
        log.info("widget getManagementConfig workspacePublicId={} userId={}", workspacePublicId, user.id)
        return workspaceWidgetService.getManagementConfig(workspacePublicId, user.id)
    }

    @PatchMapping("/widget/management")
    fun patchWidget(
        @PathVariable workspacePublicId: UUID,
        @AuthenticationPrincipal user: AuthenticatedUser,
        @Valid @RequestBody body: PatchWorkspaceWidgetRequest,
    ): WorkspaceWidgetResponse {
        log.info("widget patch workspacePublicId={} userId={}", workspacePublicId, user.id)
        return workspaceWidgetService.patch(workspacePublicId, user.id, body)
    }
}
