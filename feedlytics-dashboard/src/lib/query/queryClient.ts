/**
 * Shared QueryClient factory.
 *
 * Defaults chosen to kill duplicate calls and avoid refetch storms:
 *   - staleTime 60s — repeat mounts in 60s hit cache, not the network.
 *   - gcTime 5m    — evict unused data after 5 minutes.
 *   - refetchOnWindowFocus false — we do not want a refetch every tab-switch.
 *   - retry 1      — 5xx retried once; 4xx surface immediately.
 *
 * We construct the client per-provider (so stories/tests get a fresh one) but
 * export the factory as well as a module-level singleton for non-React code.
 */
import { QueryClient } from "@tanstack/react-query";

import { ApiError } from "@/services/api/errors/ApiError";

export const queryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: (failureCount: number, err: unknown) => {
        if (err instanceof ApiError && err.status >= 400 && err.status < 500) {
          return false;
        }
        return failureCount < 1;
      },
    },
    mutations: {
      retry: 0,
    },
  },
} as const;

export function createQueryClient(): QueryClient {
  return new QueryClient(queryClientConfig);
}
