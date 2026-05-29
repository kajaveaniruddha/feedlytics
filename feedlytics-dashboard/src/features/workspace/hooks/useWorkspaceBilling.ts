"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query/queryKeys";
import { ApiError } from "@/services/api/errors/ApiError";
import { workspaceBillingService } from "@/services/workspace/workspaceBilling.service";
import { useAuthStore } from "@/stores/auth.store";

import type { BillingInfoResponseDto } from "@/features/workspace/types/billing.types";

export function useWorkspaceBilling(workspacePublicId: string, options?: { enabled?: boolean }) {
  const isAuthenticated = useAuthStore((s) => !!s.accessToken);
  const hasId = workspacePublicId.length > 0;

  return useQuery<BillingInfoResponseDto, ApiError>({
    queryKey: queryKeys.workspace.billing(workspacePublicId),
    queryFn: () => workspaceBillingService.getBillingInfo(workspacePublicId),
    enabled: (options?.enabled ?? true) && isAuthenticated && hasId,
    staleTime: 30_000,
  });
}
