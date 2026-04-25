import { apiClient } from "../api-client";

export const billingApi = {
  getBilling: () => apiClient.get("/api/billing"),
  createBillingPortalSession: () => apiClient.post("/api/billing"),
  createCheckoutSession: (data: { plan: string; interval: string }) =>
    apiClient.post("/api/checkout-sessions", data),
};
