import { apiClient } from "./api-client";
import type { BaseApiResponse } from "./api-types";

export const api = {
  // Analytics
  getAnalytics: () =>
    apiClient.get("/api/get-analytics"),

  getSentimentCounts: () =>
    apiClient.get("/api/get-categories"),

  // Messages
  getMessages: () =>
    apiClient.get("/api/get-messages"),

  deleteMessages: (messageIds: string[]) =>
    apiClient.delete("/api/delete-messages", {
      data: { messageIds },
    }),

  // User
  getUserDetails: () =>
    apiClient.get("/api/get-user-details"),

  updateUserData: (data: Record<string, unknown>) =>
    apiClient.put("/api/update-user-data", data),

  checkUsernameUnique: (username: string) =>
    apiClient.get("/api/check-username-unique", {
      params: { username },
    }),

  register: (data: Record<string, unknown>) =>
    apiClient.post("/api/register", data),

  // Workflows
  getWorkflows: () =>
    apiClient.get("/api/user-workflows"),

  createWorkflow: (data: Record<string, unknown>) =>
    apiClient.post("/api/user-workflows", data),

  updateWorkflow: (data: Record<string, unknown>) =>
    apiClient.patch("/api/user-workflows", data),

  deleteWorkflow: (id: string | number) =>
    apiClient.delete("/api/user-workflows", {
      data: { id },
    }),

  // Billing
  getBilling: () =>
    apiClient.get("/api/billing"),

  createBillingPortalSession: () =>
    apiClient.post("/api/billing"),

  createCheckoutSession: (data: { plan: string; interval: string }) =>
    apiClient.post("/api/checkout-sessions", data),

  // Accept Messages
  getAcceptMessagesStatus: () =>
    apiClient.get("/api/accept-messages"),

  updateAcceptMessagesStatus: (acceptMessages: boolean) =>
    apiClient.put("/api/accept-messages", { acceptMessages }),

  // Project
  getProjectDetails: () =>
    apiClient.get("/api/get-project-details"),

  // Public/Widget
  getUserFormDetails: (username: string) =>
    apiClient.get(`/api/get-user-form-details/${username}`),

  sendMessage: (data: Record<string, unknown>) =>
    apiClient.post("/api/send-message", data),
};
