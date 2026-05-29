"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query/queryKeys";
import { invitesService } from "@/services/invites/invites.service";
import { useAuthStore } from "@/stores/auth.store";
import { ApiError } from "@/services/api/errors/ApiError";

import type { PendingInviteInfoDto } from "@/features/workspace/types/team.types";

export function usePendingInvites(options?: { enabled?: boolean }) {
  const isAuthenticated = useAuthStore((s) => !!s.accessToken);

  return useQuery<PendingInviteInfoDto[], ApiError>({
    queryKey: queryKeys.invites.pending(),
    queryFn: () => invitesService.listPending(),
    enabled: (options?.enabled ?? true) && isAuthenticated,
    staleTime: 30_000,
  });
}
