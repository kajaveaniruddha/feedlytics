import { apiClient } from "@/services/api/client";
import { endpoints } from "@/services/api/endpoints";

import type { WorkspaceData, WorkspaceListResponse, WorkspaceSingleResponse } from "@/features/workspace/types/workspace.types";

export type CreateWorkspaceInput = {
  name: string;
  description?: string | null;
};

export interface WorkspaceServiceContract {
  listWorkspaces(): Promise<WorkspaceData[]>;
  createWorkspace(input: CreateWorkspaceInput): Promise<WorkspaceData>;
}

class WorkspaceServiceImpl implements WorkspaceServiceContract {
  async listWorkspaces(): Promise<WorkspaceData[]> {
    const res = await apiClient.get<WorkspaceListResponse>(endpoints.workspace.root);
    return res.data.workspaces;
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
}

export const workspaceService: WorkspaceServiceContract = new WorkspaceServiceImpl();
