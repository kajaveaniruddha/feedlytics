"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query/queryKeys";
import { feedbackCategoriesService } from "@/services/feedback/feedbackCategories.service";
import { useAuthStore } from "@/stores/auth.store";
import { ApiError } from "@/services/api/errors/ApiError";

import type { FeedbackCategoryListDto } from "@/services/feedback/feedbackCategories.service";

export function useFeedbackCategories(workspacePublicId: string) {
  const isAuthenticated = useAuthStore((s) => !!s.accessToken);
  const hasId = workspacePublicId.length > 0;
  const queryClient = useQueryClient();

  const query = useQuery<FeedbackCategoryListDto, ApiError>({
    queryKey: queryKeys.workspace.feedbackCategories(workspacePublicId),
    queryFn: () => feedbackCategoriesService.list(workspacePublicId),
    enabled: isAuthenticated && hasId,
    staleTime: 15_000,
  });

  const create = useMutation({
    mutationFn: (name: string) => feedbackCategoriesService.create(workspacePublicId, name),
    onSuccess: () =>
      void queryClient.invalidateQueries({
        queryKey: queryKeys.workspace.feedbackCategories(workspacePublicId),
      }),
  });

  return { ...query, create };
}
