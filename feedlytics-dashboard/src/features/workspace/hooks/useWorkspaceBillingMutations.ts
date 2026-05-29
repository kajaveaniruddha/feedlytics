"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query/queryKeys";
import { ApiError } from "@/services/api/errors/ApiError";
import { workspaceBillingService } from "@/services/workspace/workspaceBilling.service";

import type { CheckoutSessionRequestDto, CheckoutSessionResponseDto, PortalSessionResponseDto } from "@/features/workspace/types/billing.types";

export function useCreateCheckoutSession(workspacePublicId: string) {
  const queryClient = useQueryClient();

  return useMutation<CheckoutSessionResponseDto, ApiError, CheckoutSessionRequestDto>({
    mutationFn: (input) => workspaceBillingService.createCheckoutSession(workspacePublicId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.workspace.billing(workspacePublicId) });
    },
  });
}

export function useCreatePortalSession(workspacePublicId: string) {
  const queryClient = useQueryClient();

  return useMutation<PortalSessionResponseDto, ApiError, void>({
    mutationFn: () => workspaceBillingService.createPortalSession(workspacePublicId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.workspace.billing(workspacePublicId) });
    },
  });
}
