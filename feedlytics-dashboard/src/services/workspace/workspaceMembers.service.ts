import { apiClient } from "@/services/api/client";
import { endpoints } from "@/services/api/endpoints";

import type {
  MemberListResponseDto,
  MemberResponseDto,
} from "@/features/workspace/types/team.types";
import type { WorkspaceSingleResponse } from "@/features/workspace/types/workspace.types";

export type UpdateMemberRoleBody = {
  role: "ADMIN" | "MEMBER";
};

export type TransferOwnershipBody = {
  newOwnerUserPublicId: string;
};

export interface WorkspaceMembersServiceContract {
  listMembers(workspacePublicId: string): Promise<MemberListResponseDto>;
  updateMemberRole(
    workspacePublicId: string,
    memberUserPublicId: string,
    body: UpdateMemberRoleBody,
  ): Promise<MemberResponseDto>;
  removeMember(workspacePublicId: string, memberUserPublicId: string): Promise<void>;
  leaveWorkspace(workspacePublicId: string): Promise<void>;
  transferOwnership(workspacePublicId: string, body: TransferOwnershipBody): Promise<WorkspaceSingleResponse>;
}

class WorkspaceMembersServiceImpl implements WorkspaceMembersServiceContract {
  async listMembers(workspacePublicId: string): Promise<MemberListResponseDto> {
    const res = await apiClient.get<MemberListResponseDto>(endpoints.workspace.members(workspacePublicId));
    return res.data;
  }

  async updateMemberRole(
    workspacePublicId: string,
    memberUserPublicId: string,
    body: UpdateMemberRoleBody,
  ): Promise<MemberResponseDto> {
    const res = await apiClient.put<MemberResponseDto>(
      endpoints.workspace.member(workspacePublicId, memberUserPublicId),
      body,
    );
    return res.data;
  }

  async removeMember(workspacePublicId: string, memberUserPublicId: string): Promise<void> {
    await apiClient.delete(endpoints.workspace.member(workspacePublicId, memberUserPublicId));
  }

  async leaveWorkspace(workspacePublicId: string): Promise<void> {
    await apiClient.post(endpoints.workspace.membersLeave(workspacePublicId));
  }

  async transferOwnership(
    workspacePublicId: string,
    body: TransferOwnershipBody,
  ): Promise<WorkspaceSingleResponse> {
    const res = await apiClient.post<WorkspaceSingleResponse>(
      endpoints.workspace.transferOwnership(workspacePublicId),
      body,
    );
    return res.data;
  }
}

export const workspaceMembersService: WorkspaceMembersServiceContract = new WorkspaceMembersServiceImpl();
