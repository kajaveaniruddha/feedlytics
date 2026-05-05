import { apiClient } from "@/services/api/client";
import { endpoints } from "@/services/api/endpoints";

export type WorkspaceIntegrationStatusDto = {
  success: boolean;
  hasApiKey: boolean;
  hasWidgetSecret: boolean;
  hasWidgetOrigins: boolean;
  widgetOrigins: string[];
};

export type RotateApiKeyResponseDto = {
  success: boolean;
  apiKey: string;
};

export type RotateWidgetSecretResponseDto = {
  success: boolean;
  widgetSecret: string;
};

export interface WorkspaceIntegrationServiceContract {
  getStatus(workspacePublicId: string): Promise<WorkspaceIntegrationStatusDto>;
  rotateApiKey(workspacePublicId: string): Promise<RotateApiKeyResponseDto>;
  revokeApiKey(workspacePublicId: string): Promise<void>;
  rotateWidgetSecret(workspacePublicId: string): Promise<RotateWidgetSecretResponseDto>;
  revokeWidgetSecret(workspacePublicId: string): Promise<void>;
  updateWidgetOrigins(
    workspacePublicId: string,
    origins: string[],
  ): Promise<WorkspaceIntegrationStatusDto>;
}

class WorkspaceIntegrationServiceImpl implements WorkspaceIntegrationServiceContract {
  async getStatus(workspacePublicId: string): Promise<WorkspaceIntegrationStatusDto> {
    const res = await apiClient.get<WorkspaceIntegrationStatusDto>(
      endpoints.workspace.integration(workspacePublicId),
    );
    return res.data;
  }

  async rotateApiKey(workspacePublicId: string): Promise<RotateApiKeyResponseDto> {
    const res = await apiClient.post<RotateApiKeyResponseDto>(
      endpoints.workspace.integrationApiKeyRotate(workspacePublicId),
    );
    return res.data;
  }

  async revokeApiKey(workspacePublicId: string): Promise<void> {
    await apiClient.delete(endpoints.workspace.integrationApiKey(workspacePublicId));
  }

  async rotateWidgetSecret(workspacePublicId: string): Promise<RotateWidgetSecretResponseDto> {
    const res = await apiClient.post<RotateWidgetSecretResponseDto>(
      endpoints.workspace.integrationWidgetSecretRotate(workspacePublicId),
    );
    return res.data;
  }

  async revokeWidgetSecret(workspacePublicId: string): Promise<void> {
    await apiClient.delete(endpoints.workspace.integrationWidgetSecret(workspacePublicId));
  }

  async updateWidgetOrigins(
    workspacePublicId: string,
    origins: string[],
  ): Promise<WorkspaceIntegrationStatusDto> {
    const res = await apiClient.put<WorkspaceIntegrationStatusDto>(
      endpoints.workspace.integrationWidgetOrigins(workspacePublicId),
      { origins },
    );
    return res.data;
  }
}

export const workspaceIntegrationService: WorkspaceIntegrationServiceContract =
  new WorkspaceIntegrationServiceImpl();
