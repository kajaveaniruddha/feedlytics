"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query/queryKeys";
import { workspaceIntegrationService } from "@/services/workspace/workspaceIntegration.service";
import { useAuthStore } from "@/stores/auth.store";
import { ApiError } from "@/services/api/errors/ApiError";

import type { WorkspaceIntegrationStatusDto } from "@/services/workspace/workspaceIntegration.service";

export function useWorkspaceIntegration(workspacePublicId: string) {
  const isAuthenticated = useAuthStore((s) => !!s.accessToken);
  const hasId = workspacePublicId.length > 0;
  const queryClient = useQueryClient();

  const query = useQuery<WorkspaceIntegrationStatusDto, ApiError>({
    queryKey: queryKeys.workspace.integration(workspacePublicId),
    queryFn: () => workspaceIntegrationService.getStatus(workspacePublicId),
    enabled: isAuthenticated && hasId,
    staleTime: 15_000,
  });

  const invalidate = () =>
    void queryClient.invalidateQueries({
      queryKey: queryKeys.workspace.integration(workspacePublicId),
    });

  const rotateApiKey = useMutation({
    mutationFn: () => workspaceIntegrationService.rotateApiKey(workspacePublicId),
    onSuccess: () => invalidate(),
  });

  const revokeApiKey = useMutation({
    mutationFn: () => workspaceIntegrationService.revokeApiKey(workspacePublicId),
    onSuccess: () => invalidate(),
  });

  const rotateWidgetSecret = useMutation({
    mutationFn: () => workspaceIntegrationService.rotateWidgetSecret(workspacePublicId),
    onSuccess: () => invalidate(),
  });

  const revokeWidgetSecret = useMutation({
    mutationFn: () => workspaceIntegrationService.revokeWidgetSecret(workspacePublicId),
    onSuccess: () => invalidate(),
  });

  const updateWidgetOrigins = useMutation({
    mutationFn: (origins: string[]) =>
      workspaceIntegrationService.updateWidgetOrigins(workspacePublicId, origins),
    onSuccess: () => invalidate(),
  });

  return {
    ...query,
    rotateApiKey,
    revokeApiKey,
    rotateWidgetSecret,
    revokeWidgetSecret,
    updateWidgetOrigins,
  };
}
