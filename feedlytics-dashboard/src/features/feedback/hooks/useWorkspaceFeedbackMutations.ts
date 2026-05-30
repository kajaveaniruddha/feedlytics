"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query/queryKeys";
import { feedbackWorkspaceService } from "@/services/feedback/feedbackWorkspace.service";

function invalidateFeedbacks(
  queryClient: ReturnType<typeof useQueryClient>,
  workspacePublicId: string,
) {
  void queryClient.invalidateQueries({ queryKey: queryKeys.workspace.feedbacksRoot(workspacePublicId) });
  void queryClient.invalidateQueries({ queryKey: queryKeys.workspace.overview(workspacePublicId) });
  void queryClient.invalidateQueries({ queryKey: queryKeys.workspace.byId(workspacePublicId) });
}

export function useWorkspaceFeedbackMutations(workspacePublicId: string) {
  const queryClient = useQueryClient();

  const deleteOne = useMutation({
    mutationFn: (feedbackPublicId: string) =>
      feedbackWorkspaceService.deleteFeedback(workspacePublicId, feedbackPublicId),
    onSuccess: () => invalidateFeedbacks(queryClient, workspacePublicId),
  });

  const deleteMany = useMutation({
    mutationFn: async (feedbackPublicIds: string[]) => {
      await Promise.all(
        feedbackPublicIds.map((feedbackPublicId) =>
          feedbackWorkspaceService.deleteFeedback(workspacePublicId, feedbackPublicId),
        ),
      );
    },
    onSuccess: () => invalidateFeedbacks(queryClient, workspacePublicId),
  });

  return { deleteOne, deleteMany };
}
