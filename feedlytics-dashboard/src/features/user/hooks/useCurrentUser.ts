"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { queryKeys } from "@/lib/query/queryKeys";
import { userService } from "@/services/user/user.service";
import { useAuthStore } from "@/stores/auth.store";
import { useUserStore } from "@/stores/user.store";
import { ApiError } from "@/services/api/errors/ApiError";

import type { UserProfile } from "@/features/user/types/user.types";

/**
 * Canonical current-user hook. One shared cache key means every component that
 * calls this hook shares one backend request (TanStack dedup). The store
 * mirror is updated via a side-effect so synchronous consumers (layout
 * shells) get the latest snapshot without calling useQuery again.
 */
export function useCurrentUser(options?: { enabled?: boolean }) {
  const isAuthenticated = useAuthStore((s) => !!s.accessToken);
  const setProfile = useUserStore((s) => s.setProfile);

  const query = useQuery<UserProfile, ApiError>({
    queryKey: queryKeys.user.me(),
    queryFn: () => userService.getCurrentUser(),
    enabled: (options?.enabled ?? true) && isAuthenticated,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (query.data) setProfile(query.data);
  }, [query.data, setProfile]);

  return query;
}
