package com.feedlytics.service.workspace.service

import com.feedlytics.service.workspace.dto.request.UpdateWidgetOriginsRequest
import com.feedlytics.service.workspace.dto.response.RotateApiKeyResponse
import com.feedlytics.service.workspace.dto.response.RotateWidgetSecretResponse
import com.feedlytics.service.workspace.dto.response.WorkspaceIntegrationStatusResponse
import java.util.UUID

interface WorkspaceIntegrationService {

    fun getStatus(workspacePublicId: UUID, userId: Long): WorkspaceIntegrationStatusResponse

    fun rotateApiKey(workspacePublicId: UUID, userId: Long): RotateApiKeyResponse

    fun revokeApiKey(workspacePublicId: UUID, userId: Long)

    fun rotateWidgetSecret(workspacePublicId: UUID, userId: Long): RotateWidgetSecretResponse

    fun revokeWidgetSecret(workspacePublicId: UUID, userId: Long)

    fun updateWidgetOrigins(
        workspacePublicId: UUID,
        userId: Long,
        request: UpdateWidgetOriginsRequest,
    ): WorkspaceIntegrationStatusResponse
}
