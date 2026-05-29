import { apiClient } from "@/services/api/client";
import { endpoints } from "@/services/api/endpoints";

import type {
  AcceptInviteResponseDto,
  InviteResponseDto,
  PendingInvitesResponseDto,
} from "@/features/workspace/types/team.types";

export type InviteMemberBody = {
  email: string;
  role: "ADMIN" | "MEMBER";
};

export interface InvitesServiceContract {
  listPending(): Promise<PendingInvitesResponseDto["invites"]>;
  acceptPending(inviteId: string): Promise<AcceptInviteResponseDto>;
  rejectPending(inviteId: string): Promise<void>;
  inviteToWorkspace(workspacePublicId: string, body: InviteMemberBody): Promise<InviteResponseDto["invite"]>;
  cancelWorkspaceInvite(workspacePublicId: string, inviteId: string): Promise<void>;
  resendWorkspaceInvite(workspacePublicId: string, inviteId: string): Promise<InviteResponseDto["invite"]>;
}

class InvitesServiceImpl implements InvitesServiceContract {
  async listPending(): Promise<PendingInvitesResponseDto["invites"]> {
    const res = await apiClient.get<PendingInvitesResponseDto>(endpoints.invites.pending);
    return res.data.invites;
  }

  async acceptPending(inviteId: string): Promise<AcceptInviteResponseDto> {
    const res = await apiClient.post<AcceptInviteResponseDto>(endpoints.invites.pendingAccept(inviteId));
    return res.data;
  }

  async rejectPending(inviteId: string): Promise<void> {
    await apiClient.post(endpoints.invites.pendingReject(inviteId));
  }

  async inviteToWorkspace(
    workspacePublicId: string,
    body: InviteMemberBody,
  ): Promise<InviteResponseDto["invite"]> {
    const res = await apiClient.post<InviteResponseDto>(endpoints.invites.workspaceInvites(workspacePublicId), body);
    return res.data.invite;
  }

  async cancelWorkspaceInvite(workspacePublicId: string, inviteId: string): Promise<void> {
    await apiClient.delete(endpoints.invites.workspaceInvite(workspacePublicId, inviteId));
  }

  async resendWorkspaceInvite(workspacePublicId: string, inviteId: string): Promise<InviteResponseDto["invite"]> {
    const res = await apiClient.post<InviteResponseDto>(
      endpoints.invites.workspaceInviteResend(workspacePublicId, inviteId),
    );
    return res.data.invite;
  }
}

export const invitesService: InvitesServiceContract = new InvitesServiceImpl();
