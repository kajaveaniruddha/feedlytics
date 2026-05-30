"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query/queryKeys";
import { ApiError } from "@/services/api/errors/ApiError";
import { workspaceService } from "@/services/workspace/workspace.service";
import { useAuthStore } from "@/stores/auth.store";

import type { WorkspacePlanUsageResponseDto } from "@/features/workspace/types/plan-usage.types";

export function useWorkspacePlanUsage(workspacePublicId: string, options?: { enabled?: boolean }) {
  const isAuthenticated = useAuthStore((s) => !!s.accessToken);
  const hasId = workspacePublicId.length > 0;

  return useQuery<WorkspacePlanUsageResponseDto, ApiError>({
    queryKey: queryKeys.workspace.planUsage(workspacePublicId),
    queryFn: () => workspaceService.getPlanUsage(workspacePublicId),
    enabled: (options?.enabled ?? true) && isAuthenticated && hasId,
    staleTime: 30_000,
  });
}
