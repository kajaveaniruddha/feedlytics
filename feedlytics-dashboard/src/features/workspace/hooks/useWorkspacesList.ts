"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query/queryKeys";
import { workspaceService } from "@/services/workspace/workspace.service";
import { useAuthStore } from "@/stores/auth.store";
import { ApiError } from "@/services/api/errors/ApiError";

import type { WorkspaceData } from "@/features/workspace/types/workspace.types";

export function useWorkspacesList(options?: { enabled?: boolean }) {
  const isAuthenticated = useAuthStore((s) => !!s.accessToken);

  return useQuery<WorkspaceData[], ApiError>({
    queryKey: queryKeys.workspace.list(),
    queryFn: () => workspaceService.listWorkspaces(),
    enabled: (options?.enabled ?? true) && isAuthenticated,
    staleTime: 30_000,
  });
}
