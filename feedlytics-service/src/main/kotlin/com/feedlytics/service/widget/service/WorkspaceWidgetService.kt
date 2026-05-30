package com.feedlytics.service.widget.service

import com.feedlytics.service.widget.dto.request.PatchWorkspaceWidgetRequest
import com.feedlytics.service.widget.dto.response.WorkspaceWidgetResponse
import java.util.UUID

interface WorkspaceWidgetService {
    fun getPublicConfig(workspacePublicId: UUID, origin: String?): WorkspaceWidgetResponse

    fun getManagementConfig(workspacePublicId: UUID, userId: Long): WorkspaceWidgetResponse

    fun patch(workspacePublicId: UUID, userId: Long, request: PatchWorkspaceWidgetRequest): WorkspaceWidgetResponse
}
