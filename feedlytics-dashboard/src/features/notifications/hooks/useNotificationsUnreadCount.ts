"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query/queryKeys";
import { notificationsService } from "@/services/notifications/notifications.service";
import { useAuthStore } from "@/stores/auth.store";
import { ApiError } from "@/services/api/errors/ApiError";

import type { NotificationUnreadCountDto } from "@/features/notifications/types/notification.types";

export function useNotificationsUnreadCount(options?: { enabled?: boolean }) {
  const isAuthenticated = useAuthStore((s) => !!s.accessToken);

  return useQuery<NotificationUnreadCountDto, ApiError>({
    queryKey: queryKeys.notifications.unread(),
    queryFn: () => notificationsService.unreadCount(),
    enabled: (options?.enabled ?? true) && isAuthenticated,
    staleTime: 15_000,
  });
}
