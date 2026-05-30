import { apiClient } from "@/services/api/client";
import { endpoints } from "@/services/api/endpoints";

import type { WorkspacePlanUsageResponseDto } from "@/features/workspace/types/plan-usage.types";
import type { WorkspaceData, WorkspaceListResponse, WorkspaceSingleResponse } from "@/features/workspace/types/workspace.types";

export type CreateWorkspaceInput = {
  name: string;
  description?: string | null;
};

export interface WorkspaceServiceContract {
  listWorkspaces(): Promise<WorkspaceData[]>;
  getWorkspace(publicId: string): Promise<WorkspaceData>;
  getPlanUsage(publicId: string): Promise<WorkspacePlanUsageResponseDto>;
  createWorkspace(input: CreateWorkspaceInput): Promise<WorkspaceData>;
  deleteWorkspace(publicId: string): Promise<void>;
}

class WorkspaceServiceImpl implements WorkspaceServiceContract {
  async listWorkspaces(): Promise<WorkspaceData[]> {
    const res = await apiClient.get<WorkspaceListResponse>(endpoints.workspace.root);
    return res.data.workspaces;
  }

  async getWorkspace(publicId: string): Promise<WorkspaceData> {
    const res = await apiClient.get<WorkspaceSingleResponse>(endpoints.workspace.byId(publicId));
    return res.data.workspace;
  }

  async getPlanUsage(publicId: string): Promise<WorkspacePlanUsageResponseDto> {
    const res = await apiClient.get<WorkspacePlanUsageResponseDto>(endpoints.workspace.planUsage(publicId));
    return res.data;
  }

  async createWorkspace(input: CreateWorkspaceInput): Promise<WorkspaceData> {
    const body = {
      name: input.name,
      ...(input.description != null && input.description !== ""
        ? { description: input.description }
        : {}),
    };
    const res = await apiClient.post<WorkspaceSingleResponse>(endpoints.workspace.root, body);
    return res.data.workspace;
  }

  async deleteWorkspace(publicId: string): Promise<void> {
    await apiClient.delete(endpoints.workspace.byId(publicId));
  }
}

export const workspaceService: WorkspaceServiceContract = new WorkspaceServiceImpl();
