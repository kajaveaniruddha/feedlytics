package com.feedlytics.service.workspace.service

import com.feedlytics.service.workspace.dto.request.CreateWorkspaceRequest
import com.feedlytics.service.workspace.dto.request.TransferOwnershipRequest
import com.feedlytics.service.workspace.dto.request.UpdateWorkspaceRequest
import com.feedlytics.service.workspace.dto.response.WorkspaceListResponse
import com.feedlytics.service.workspace.dto.response.WorkspaceResponse
import java.util.UUID

interface WorkspaceService {

    fun createWorkspace(request: CreateWorkspaceRequest, userId: Long): WorkspaceResponse

    fun getWorkspacesForUser(userId: Long): WorkspaceListResponse

    fun getWorkspace(workspacePublicId: UUID, userId: Long): WorkspaceResponse

    fun updateWorkspace(workspacePublicId: UUID, request: UpdateWorkspaceRequest, userId: Long): WorkspaceResponse

    fun deleteWorkspace(workspacePublicId: UUID, userId: Long)

    fun transferOwnership(workspacePublicId: UUID, request: TransferOwnershipRequest, requesterId: Long): WorkspaceResponse
}
