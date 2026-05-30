"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query/queryKeys";
import { feedbackWorkspaceService } from "@/services/feedback/feedbackWorkspace.service";
import { useAuthStore } from "@/stores/auth.store";
import { ApiError } from "@/services/api/errors/ApiError";

import type { FeedbackListResponseDto } from "@/features/feedback/types/workspace-feedback.types";

export function useWorkspaceFeedbacks(
  workspacePublicId: string,
  params: { page: number; size: number },
  options?: { enabled?: boolean },
) {
  const isAuthenticated = useAuthStore((s) => !!s.accessToken);
  const hasId = workspacePublicId.length > 0;

  return useQuery<FeedbackListResponseDto, ApiError>({
    queryKey: queryKeys.workspace.feedbacks(workspacePublicId, params.page, params.size),
    queryFn: () => feedbackWorkspaceService.listFeedbacks(workspacePublicId, params),
    enabled: (options?.enabled ?? true) && isAuthenticated && hasId,
    staleTime: 15_000,
  });
}
