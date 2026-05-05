import { apiClient } from "@/services/api/client";
import { endpoints } from "@/services/api/endpoints";

import type { WorkspaceOverviewAnalytics } from "@/features/workspace/types/overview.types";

export interface FeedbackWorkspaceServiceContract {
  getOverviewAnalytics(workspacePublicId: string): Promise<WorkspaceOverviewAnalytics>;
}

class FeedbackWorkspaceServiceImpl implements FeedbackWorkspaceServiceContract {
  async getOverviewAnalytics(workspacePublicId: string): Promise<WorkspaceOverviewAnalytics> {
    const res = await apiClient.get<WorkspaceOverviewAnalytics>(
      endpoints.feedback.workspaceOverview(workspacePublicId),
    );
    return res.data;
  }
}

export const feedbackWorkspaceService: FeedbackWorkspaceServiceContract =
  new FeedbackWorkspaceServiceImpl();
