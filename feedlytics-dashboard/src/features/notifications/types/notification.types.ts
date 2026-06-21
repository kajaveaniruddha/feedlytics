export type NotificationReadStatus = "UNREAD" | "READ";

export type NotificationDeliveryStatus = "PENDING" | "SENT" | "FAILED";

export type NotificationPayloadDto = {
  title: string;
  description?: string;
  entityIds?: {
    workspacePublicId?: string;
    inviteId?: string;
    inviterUserPublicId?: string;
  };
  severity?: string;
};

export type NotificationItemDto = {
  publicId: string;
  type: string;
  readStatus: NotificationReadStatus;
  readAt: string | null;
  deliveryStatus: NotificationDeliveryStatus;
  workspacePublicId: string | null;
  payload: NotificationPayloadDto;
  createdAt: string;
  updatedAt: string;
};

export type NotificationListResponseDto = {
  items: NotificationItemDto[];
  nextCursor: string | null;
  hasMore: boolean;
};

export type NotificationUnreadCountDto = {
  count: number;
};
