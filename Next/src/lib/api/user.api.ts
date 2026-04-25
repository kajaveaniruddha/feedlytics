import { apiClient } from "../api-client";

export const userApi = {
  getUserDetails: () => apiClient.get("/api/get-user-details"),
  updateUserData: (data: Record<string, unknown>) =>
    apiClient.put("/api/update-user-data", data),
  checkUsernameUnique: (username: string) =>
    apiClient.get("/api/check-username-unique", { params: { username } }),
  register: (data: Record<string, unknown>) =>
    apiClient.post("/api/register", data),
  getAcceptMessagesStatus: () => apiClient.get("/api/accept-messages"),
  updateAcceptMessagesStatus: (acceptMessages: boolean) =>
    apiClient.put("/api/accept-messages", { acceptMessages }),
  getProjectDetails: () => apiClient.get("/api/get-project-details"),
  getUserFormDetails: (username: string) =>
    apiClient.get(`/api/get-user-form-details/${username}`),
};
