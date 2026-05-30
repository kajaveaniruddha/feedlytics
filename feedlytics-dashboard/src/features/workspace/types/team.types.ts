import type { MemberStatus, WorkspaceRole } from "@/features/workspace/types/workspace.types";

export type MemberDataDto = {
  userPublicId: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: WorkspaceRole;
  status: MemberStatus;
  joinedAt: string;
};

export type InviteDataDto = {
  invitePublicId: string;
  email: string;
  role: WorkspaceRole;
  status: string;
  expiresAt: string;
  createdAt: string;
  token?: string | null;
};

export type MemberListResponseDto = {
  success: boolean;
  members: MemberDataDto[];
  pendingInvites: InviteDataDto[];
};

export type MemberResponseDto = {
  success: boolean;
  message?: string | null;
  member: MemberDataDto;
};

export type InviteResponseDto = {
  success: boolean;
  message: string;
  invite: InviteDataDto;
};

export type PendingInviteInfoDto = {
  inviteId: string;
  workspacePublicId: string;
  workspaceName: string;
  role: string;
  invitedAt: string;
  expiresAt: string;
};

export type PendingInvitesResponseDto = {
  success: boolean;
  invites: PendingInviteInfoDto[];
};

export type AcceptInviteResponseDto = {
  success: boolean;
  message: string;
  workspacePublicId: string;
  workspaceName: string;
  member: MemberDataDto;
};
