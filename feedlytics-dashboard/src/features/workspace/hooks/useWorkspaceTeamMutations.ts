"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query/queryKeys";
import { invitesService, type InviteMemberBody } from "@/services/invites/invites.service";
import {
  workspaceMembersService,
  type TransferOwnershipBody,
  type UpdateMemberRoleBody,
} from "@/services/workspace/workspaceMembers.service";
function invalidateTeam(queryClient: ReturnType<typeof useQueryClient>, workspacePublicId: string) {
  void queryClient.invalidateQueries({ queryKey: queryKeys.workspace.members(workspacePublicId) });
  void queryClient.invalidateQueries({ queryKey: queryKeys.workspace.byId(workspacePublicId) });
  void queryClient.invalidateQueries({ queryKey: queryKeys.workspace.list() });
}

export function useWorkspaceTeamMutations(workspacePublicId: string) {
  const queryClient = useQueryClient();

  const inviteMember = useMutation({
    mutationFn: (body: InviteMemberBody) => invitesService.inviteToWorkspace(workspacePublicId, body),
    onSuccess: () => invalidateTeam(queryClient, workspacePublicId),
  });

  const cancelInvite = useMutation({
    mutationFn: (inviteId: string) => invitesService.cancelWorkspaceInvite(workspacePublicId, inviteId),
    onSuccess: () => invalidateTeam(queryClient, workspacePublicId),
  });

  const resendInvite = useMutation({
    mutationFn: (inviteId: string) => invitesService.resendWorkspaceInvite(workspacePublicId, inviteId),
    onSuccess: () => invalidateTeam(queryClient, workspacePublicId),
  });

  const updateMemberRole = useMutation({
    mutationFn: ({
      memberUserPublicId,
      body,
    }: {
      memberUserPublicId: string;
      body: UpdateMemberRoleBody;
    }) => workspaceMembersService.updateMemberRole(workspacePublicId, memberUserPublicId, body),
    onSuccess: () => invalidateTeam(queryClient, workspacePublicId),
  });

  const removeMember = useMutation({
    mutationFn: (memberUserPublicId: string) =>
      workspaceMembersService.removeMember(workspacePublicId, memberUserPublicId),
    onSuccess: () => invalidateTeam(queryClient, workspacePublicId),
  });

  const leaveWorkspace = useMutation({
    mutationFn: () => workspaceMembersService.leaveWorkspace(workspacePublicId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.workspace.list() });
      void queryClient.invalidateQueries({ queryKey: queryKeys.workspace.byId(workspacePublicId) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.workspace.members(workspacePublicId) });
    },
  });

  const transferOwnership = useMutation({
    mutationFn: (body: TransferOwnershipBody) =>
      workspaceMembersService.transferOwnership(workspacePublicId, body),
    onSuccess: () => invalidateTeam(queryClient, workspacePublicId),
  });

  return {
    inviteMember,
    cancelInvite,
    resendInvite,
    updateMemberRole,
    removeMember,
    leaveWorkspace,
    transferOwnership,
  };
}
