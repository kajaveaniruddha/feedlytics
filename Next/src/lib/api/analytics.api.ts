import { apiClient } from "../api-client";

export const analyticsApi = {
  getAnalytics: () => apiClient.get("/api/get-analytics"),
  getSentimentCounts: () => apiClient.get("/api/get-categories"),
};
