"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query/queryKeys";
import type { PatchWorkspaceWidgetBody, WorkspaceWidgetDto } from "@/services/workspace/workspaceWidget.service";
import { workspaceWidgetService } from "@/services/workspace/workspaceWidget.service";
import { useAuthStore } from "@/stores/auth.store";
import { ApiError } from "@/services/api/errors/ApiError";

export function useWorkspaceWidgetManagement(workspacePublicId: string) {
  const isAuthenticated = useAuthStore((s) => !!s.accessToken);
  const hasId = workspacePublicId.length > 0;
  const queryClient = useQueryClient();

  const query = useQuery<WorkspaceWidgetDto, ApiError>({
    queryKey: queryKeys.workspace.widgetManagement(workspacePublicId),
    queryFn: () => workspaceWidgetService.getManagement(workspacePublicId),
    enabled: isAuthenticated && hasId,
    staleTime: 15_000,
  });

  const patchWidget = useMutation({
    mutationFn: (body: PatchWorkspaceWidgetBody) =>
      workspaceWidgetService.patch(workspacePublicId, body),
    onSuccess: () =>
      void queryClient.invalidateQueries({
        queryKey: queryKeys.workspace.widgetManagement(workspacePublicId),
      }),
  });

  return {
    ...query,
    patchWidget,
  };
}
