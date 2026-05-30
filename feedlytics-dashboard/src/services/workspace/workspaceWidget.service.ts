import { apiClient } from "@/services/api/client";
import { endpoints } from "@/services/api/endpoints";

export type WidgetThemeDto = {
  formBgColor: string;
  formTextColor: string;
  accentColor: string;
  inputBgColor: string;
  inputBorderColor: string;
  inputTextColor: string;
  secondaryTextColor: string;
  fontFamily: string;
  borderRadius: number;
  shadow: "none" | "subtle" | "medium" | "strong";
  cardMaxWidth: number;
  cardPadding: "compact" | "default" | "spacious";
  successMessage: string;
  showConfetti: boolean;
  successRedirectUrl: string | null;
  successCtaText: string | null;
  successCtaUrl: string | null;
  buttonText: string;
};

export type WorkspaceWidgetDto = {
  collectName: boolean;
  collectEmail: boolean;
  theme: WidgetThemeDto;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PatchWorkspaceWidgetBody = {
  collectName?: boolean;
  collectEmail?: boolean;
  isActive?: boolean;
  /** Full theme document when updating appearance (matches backend replace semantics). */
  theme?: WidgetThemeDto;
};

export interface WorkspaceWidgetServiceContract {
  getManagement(workspacePublicId: string): Promise<WorkspaceWidgetDto>;
  patch(workspacePublicId: string, body: PatchWorkspaceWidgetBody): Promise<WorkspaceWidgetDto>;
}

class WorkspaceWidgetServiceImpl implements WorkspaceWidgetServiceContract {
  async getManagement(workspacePublicId: string): Promise<WorkspaceWidgetDto> {
    const res = await apiClient.get<WorkspaceWidgetDto>(endpoints.workspace.widgetManagement(workspacePublicId));
    return res.data;
  }

  async patch(workspacePublicId: string, body: PatchWorkspaceWidgetBody): Promise<WorkspaceWidgetDto> {
    const res = await apiClient.patch<WorkspaceWidgetDto>(
      endpoints.workspace.widgetManagement(workspacePublicId),
      body,
    );
    return res.data;
  }
}

export const workspaceWidgetService: WorkspaceWidgetServiceContract = new WorkspaceWidgetServiceImpl();
