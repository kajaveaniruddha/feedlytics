import { apiClient } from "@/services/api/client";
import { endpoints } from "@/services/api/endpoints";

import type {
  NotificationItemDto,
  NotificationListResponseDto,
  NotificationUnreadCountDto,
} from "@/features/notifications/types/notification.types";

export interface NotificationsServiceContract {
  list(params?: { cursor?: string; limit?: number }): Promise<NotificationListResponseDto>;
  unreadCount(): Promise<NotificationUnreadCountDto>;
  getById(publicId: string): Promise<NotificationItemDto>;
}

class NotificationsServiceImpl implements NotificationsServiceContract {
  async list(params?: { cursor?: string; limit?: number }): Promise<NotificationListResponseDto> {
    const res = await apiClient.get<NotificationListResponseDto>(endpoints.notifications.list, {
      params: {
        cursor: params?.cursor,
        limit: params?.limit ?? 20,
        readStatus: "all",
      },
    });
    return res.data;
  }

  async unreadCount(): Promise<NotificationUnreadCountDto> {
    const res = await apiClient.get<NotificationUnreadCountDto>(endpoints.notifications.unreadCount);
    return res.data;
  }

  async getById(publicId: string): Promise<NotificationItemDto> {
    const res = await apiClient.get<NotificationItemDto>(endpoints.notifications.byId(publicId));
    return res.data;
  }
}

export const notificationsService: NotificationsServiceContract = new NotificationsServiceImpl();
