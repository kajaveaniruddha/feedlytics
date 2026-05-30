package com.feedlytics.service.workspace.service

import com.feedlytics.service.workspace.dto.request.UpdateMemberRoleRequest
import com.feedlytics.service.workspace.dto.response.MemberListResponse
import com.feedlytics.service.workspace.dto.response.MemberResponse
import java.util.UUID

interface WorkspaceMemberService {

    fun getMembers(workspacePublicId: UUID, requesterId: Long): MemberListResponse

    fun updateMemberRole(
        workspacePublicId: UUID,
        memberUserPublicId: UUID,
        request: UpdateMemberRoleRequest,
        requesterId: Long
    ): MemberResponse

    fun removeMember(
        workspacePublicId: UUID,
        memberUserPublicId: UUID,
        requesterId: Long
    )

    fun leaveWorkspace(workspacePublicId: UUID, userId: Long)
}
