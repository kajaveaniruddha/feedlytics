"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";

import { env } from "@/config/env";
import { queryKeys } from "@/lib/query/queryKeys";
import { useAccessToken } from "@/stores/auth.store";

function apiBaseToWsBase(apiBase: string): string {
  if (apiBase.startsWith("https://")) return `wss://${apiBase.slice("https://".length)}`;
  if (apiBase.startsWith("http://")) return `ws://${apiBase.slice("http://".length)}`;
  return apiBase.replace(/^http/i, "ws");
}

export function NotificationRealtimeSubscriber() {
  const accessToken = useAccessToken();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (!accessToken) return;

    const wsBase = apiBaseToWsBase(env.apiBaseUrl.replace(/\/$/, ""));
    const url = `${wsBase}/api/v1/notifications/stream?access_token=${encodeURIComponent(accessToken)}`;
    let ws: WebSocket | null = null;
    let closed = false;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    const invalidateInbox = () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.invites.pending() });
      void queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unread() });
      void queryClient.invalidateQueries({ queryKey: queryKeys.notifications.root });
    };

    const connect = () => {
      if (closed) return;
      ws = new WebSocket(url);

      ws.onmessage = (evt) => {
        try {
          const msg = JSON.parse(String(evt.data)) as { event?: string };
          if (msg.event === "notification.new") {
            invalidateInbox();
          } else if (msg.event === "notification.removed") {
            invalidateInbox();
          }
        } catch {
          // ignore non-JSON
        }
      };

      ws.onclose = () => {
        if (closed) return;
        reconnectTimer = setTimeout(connect, 4000);
      };

      ws.onerror = () => {
        ws?.close();
      };
    };

    connect();

    const ping = setInterval(() => {
      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "ping" }));
      }
    }, 25_000);

    return () => {
      closed = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      clearInterval(ping);
      ws?.close();
    };
  }, [accessToken, queryClient]);

  return null;
}
