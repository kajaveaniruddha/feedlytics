"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query/queryKeys";
import { invitesService } from "@/services/invites/invites.service";

export function usePendingInviteMutations() {
  const queryClient = useQueryClient();

  const invalidateAfterInboxChange = () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.invites.pending() });
    void queryClient.invalidateQueries({ queryKey: queryKeys.workspace.list() });
  };

  const acceptPending = useMutation({
    mutationFn: (inviteId: string) => invitesService.acceptPending(inviteId),
    onSuccess: (data) => {
      invalidateAfterInboxChange();
      const id = data.workspacePublicId;
      void queryClient.invalidateQueries({ queryKey: queryKeys.workspace.members(id) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.workspace.byId(id) });
    },
  });

  const rejectPending = useMutation({
    mutationFn: (inviteId: string) => invitesService.rejectPending(inviteId),
    onSuccess: () => {
      invalidateAfterInboxChange();
    },
  });

  return { acceptPending, rejectPending };
}
