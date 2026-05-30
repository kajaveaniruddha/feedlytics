"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query/queryKeys";
import { workspaceMembersService } from "@/services/workspace/workspaceMembers.service";
import { useAuthStore } from "@/stores/auth.store";
import { ApiError } from "@/services/api/errors/ApiError";

import type { MemberListResponseDto } from "@/features/workspace/types/team.types";

export function useWorkspaceMembers(workspacePublicId: string, options?: { enabled?: boolean }) {
  const isAuthenticated = useAuthStore((s) => !!s.accessToken);
  const hasId = workspacePublicId.length > 0;

  return useQuery<MemberListResponseDto, ApiError>({
    queryKey: queryKeys.workspace.members(workspacePublicId),
    queryFn: () => workspaceMembersService.listMembers(workspacePublicId),
    enabled: (options?.enabled ?? true) && isAuthenticated && hasId,
    staleTime: 15_000,
  });
}
