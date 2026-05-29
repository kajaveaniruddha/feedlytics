"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query/queryKeys";
import { workspaceService } from "@/services/workspace/workspace.service";
import { useAuthStore } from "@/stores/auth.store";
import { ApiError } from "@/services/api/errors/ApiError";

import type { WorkspaceData } from "@/features/workspace/types/workspace.types";

export function useWorkspaceDetail(workspacePublicId: string, options?: { enabled?: boolean }) {
  const isAuthenticated = useAuthStore((s) => !!s.accessToken);
  const hasId = workspacePublicId.length > 0;

  return useQuery<WorkspaceData, ApiError>({
    queryKey: queryKeys.workspace.byId(workspacePublicId),
    queryFn: () => workspaceService.getWorkspace(workspacePublicId),
    enabled: (options?.enabled ?? true) && isAuthenticated && hasId,
    staleTime: 30_000,
  });
}
