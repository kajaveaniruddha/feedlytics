import { apiClient } from "../api-client";

export const feedbackApi = {
  getMessages: () => apiClient.get("/api/get-messages"),
  deleteMessages: (messageIds: string[]) =>
    apiClient.delete("/api/delete-messages", { data: { messageIds } }),
  /** @deprecated Use feedlytics-service public send-feedback API from embeds. */
  sendMessage: (data: Record<string, unknown>) =>
    apiClient.post("/api/send-message", data),
};
