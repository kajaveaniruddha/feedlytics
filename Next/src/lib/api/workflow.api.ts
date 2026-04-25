import { apiClient } from "../api-client";

export const workflowApi = {
  getWorkflows: () => apiClient.get("/api/user-workflows"),
  createWorkflow: (data: Record<string, unknown>) =>
    apiClient.post("/api/user-workflows", data),
  updateWorkflow: (data: Record<string, unknown>) =>
    apiClient.patch("/api/user-workflows", data),
  deleteWorkflow: (id: string | number) =>
    apiClient.delete("/api/user-workflows", { data: { id } }),
};
