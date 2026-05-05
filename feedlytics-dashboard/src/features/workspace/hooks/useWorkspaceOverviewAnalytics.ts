"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query/queryKeys";
import { feedbackWorkspaceService } from "@/services/feedback/feedbackWorkspace.service";
import { useAuthStore } from "@/stores/auth.store";
import { ApiError } from "@/services/api/errors/ApiError";

import type { WorkspaceOverviewAnalytics } from "@/features/workspace/types/overview.types";

export function useWorkspaceOverviewAnalytics(
  workspacePublicId: string,
  options?: { enabled?: boolean },
) {
  const isAuthenticated = useAuthStore((s) => !!s.accessToken);
  const hasId = workspacePublicId.length > 0;

  return useQuery<WorkspaceOverviewAnalytics, ApiError>({
    queryKey: queryKeys.workspace.overview(workspacePublicId),
    queryFn: () => feedbackWorkspaceService.getOverviewAnalytics(workspacePublicId),
    enabled: (options?.enabled ?? true) && isAuthenticated && hasId,
    staleTime: 30_000,
  });
}
