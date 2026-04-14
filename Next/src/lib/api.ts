import { apiClient } from "./api-client";

export const api = {
  // Analytics
  getAnalytics: () => apiClient.get("/api/get-analytics"),
  getSentimentCounts: () => apiClient.get("/api/get-categories"),

  // Messages
  getMessages: (params: {
    page?: number;
    limit?: number;
    sortBy?: "createdAt" | "stars";
    sortOrder?: "asc" | "desc";
    content?: string;
    stars?: number[];
    sentiment?: string[];
    category?: string[];
  }) =>
    apiClient.get("/api/get-messages", {
      params: {
        ...params,
        stars: params.stars?.join(","),
        sentiment: params.sentiment?.join(","),
        category: params.category?.join(","),
      },
    }),

  deleteMessages: (messageIds: string[]) =>
    apiClient.delete("/api/delete-messages", { data: { messageIds } }),

  sendMessage: (data: {
    username: string;
    stars: number;
    content: string;
    email?: string | null;
    name?: string;
  }) => apiClient.post("/api/send-message", data),

  // User
  getUserDetails: () => apiClient.get("/api/get-user-details"),

  updateUserData: (data: {
    name: string;
    username: string;
    avatar_url: string;
    introduction?: string;
    questions: string[];
    bg_color: string;
    text_color: string;
    collect_info: { name: boolean; email: boolean };
  }) => apiClient.put("/api/update-user-data", data),

  checkUsernameUnique: (username: string) =>
    apiClient.get("/api/check-username-unique", { params: { username } }),

  // Workflows
  getWorkflows: () => apiClient.get("/api/user-workflows"),

  createWorkflow: (data: {
    provider: "googlechat" | "slack";
    groupName: string;
    webhookUrl: string;
    notifyCategories: string[];
    isActive?: boolean;
  }) => apiClient.post("/api/user-workflows", data),

  updateWorkflow: (data: {
    id: string | number;
    provider?: string;
    groupName?: string;
    webhookUrl?: string;
    notifyCategories?: string[];
    isActive?: boolean;
  }) => apiClient.patch("/api/user-workflows", data),

  deleteWorkflow: (id: string | number) =>
    apiClient.delete("/api/user-workflows", { data: { id } }),

  // Billing
  getBilling: () => apiClient.get("/api/billing"),

  createBillingPortal: () => apiClient.post("/api/billing"),

  createCheckoutSession: (data: {
    plan: "pro" | "business";
    interval: "monthly" | "yearly";
  }) => apiClient.post("/api/checkout-sessions", data),

  // Accept Messages
  getAcceptMessagesStatus: () => apiClient.get("/api/accept-messages"),

  updateAcceptMessagesStatus: (acceptMessages: boolean) =>
    apiClient.put("/api/accept-messages", { acceptMessages }),

  // Project
  getProjectDetails: () => apiClient.get("/api/get-project-details"),

  // Public/Widget
  getUserFormDetails: (username: string) =>
    apiClient.get(`/api/get-user-form-details/${username}`),

  // Registration
  register: (data: {
    name: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => apiClient.post("/api/register", data),

  // Verification
  verifyCode: (data: { username: string; code: string }) =>
    apiClient.post("/api/verify-code", data),
};
