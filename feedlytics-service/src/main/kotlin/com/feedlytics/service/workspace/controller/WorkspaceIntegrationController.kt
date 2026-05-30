package com.feedlytics.service.workspace.controller

import com.feedlytics.service.common.security.AuthenticatedUser
import com.feedlytics.service.workspace.dto.request.UpdateWidgetOriginsRequest
import com.feedlytics.service.workspace.dto.response.RotateApiKeyResponse
import com.feedlytics.service.workspace.dto.response.RotateWidgetSecretResponse
import com.feedlytics.service.workspace.dto.response.WorkspaceIntegrationStatusResponse
import com.feedlytics.service.workspace.service.WorkspaceIntegrationService
import jakarta.validation.Valid
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
@RequestMapping("/api/v1/workspaces/{workspacePublicId}/integration")
class WorkspaceIntegrationController(
    private val workspaceIntegrationService: WorkspaceIntegrationService,
) {

    @GetMapping
    fun getStatus(
        @PathVariable workspacePublicId: UUID,
        @AuthenticationPrincipal user: AuthenticatedUser,
    ): WorkspaceIntegrationStatusResponse =
        workspaceIntegrationService.getStatus(workspacePublicId, user.id)

    @PostMapping("/api-key/rotate")
    fun rotateApiKey(
        @PathVariable workspacePublicId: UUID,
        @AuthenticationPrincipal user: AuthenticatedUser,
    ): RotateApiKeyResponse =
        workspaceIntegrationService.rotateApiKey(workspacePublicId, user.id)

    @DeleteMapping("/api-key")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun revokeApiKey(
        @PathVariable workspacePublicId: UUID,
        @AuthenticationPrincipal user: AuthenticatedUser,
    ) {
        workspaceIntegrationService.revokeApiKey(workspacePublicId, user.id)
    }

    @PostMapping("/widget-secret/rotate")
    fun rotateWidgetSecret(
        @PathVariable workspacePublicId: UUID,
        @AuthenticationPrincipal user: AuthenticatedUser,
    ): RotateWidgetSecretResponse =
        workspaceIntegrationService.rotateWidgetSecret(workspacePublicId, user.id)

    @DeleteMapping("/widget-secret")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun revokeWidgetSecret(
        @PathVariable workspacePublicId: UUID,
        @AuthenticationPrincipal user: AuthenticatedUser,
    ) {
        workspaceIntegrationService.revokeWidgetSecret(workspacePublicId, user.id)
    }

    @PutMapping("/widget-origins")
    fun updateWidgetOrigins(
        @PathVariable workspacePublicId: UUID,
        @AuthenticationPrincipal user: AuthenticatedUser,
        @Valid @RequestBody body: UpdateWidgetOriginsRequest,
    ): WorkspaceIntegrationStatusResponse =
        workspaceIntegrationService.updateWidgetOrigins(workspacePublicId, user.id, body)
}
