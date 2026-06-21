"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query/queryKeys";
import { notificationsService } from "@/services/notifications/notifications.service";
import { useAuthStore } from "@/stores/auth.store";
import { ApiError } from "@/services/api/errors/ApiError";

import type { NotificationListResponseDto } from "@/features/notifications/types/notification.types";

export function useNotificationsPreview(options?: { enabled?: boolean; limit?: number }) {
  const isAuthenticated = useAuthStore((s) => !!s.accessToken);
  const limit = options?.limit ?? 10;

  return useQuery<NotificationListResponseDto, ApiError>({
    queryKey: queryKeys.notifications.list(null),
    queryFn: () => notificationsService.list({ limit }),
    enabled: (options?.enabled ?? true) && isAuthenticated,
    staleTime: 15_000,
  });
}
