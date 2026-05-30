import { apiClient } from "@/services/api/client";
import { endpoints } from "@/services/api/endpoints";

import type { FeedbackListResponseDto } from "@/features/feedback/types/workspace-feedback.types";
import type { WorkspaceOverviewAnalytics } from "@/features/workspace/types/overview.types";

export interface FeedbackWorkspaceServiceContract {
  getOverviewAnalytics(workspacePublicId: string): Promise<WorkspaceOverviewAnalytics>;
  listFeedbacks(
    workspacePublicId: string,
    params: { page: number; size: number },
  ): Promise<FeedbackListResponseDto>;
  deleteFeedback(workspacePublicId: string, feedbackPublicId: string): Promise<void>;
}

class FeedbackWorkspaceServiceImpl implements FeedbackWorkspaceServiceContract {
  async getOverviewAnalytics(workspacePublicId: string): Promise<WorkspaceOverviewAnalytics> {
    const res = await apiClient.get<WorkspaceOverviewAnalytics>(
      endpoints.feedback.workspaceOverview(workspacePublicId),
    );
    return res.data;
  }

  async listFeedbacks(
    workspacePublicId: string,
    params: { page: number; size: number },
  ): Promise<FeedbackListResponseDto> {
    const res = await apiClient.get<FeedbackListResponseDto>(
      endpoints.feedback.workspaceList(workspacePublicId),
      { params },
    );
    return res.data;
  }

  async deleteFeedback(workspacePublicId: string, feedbackPublicId: string): Promise<void> {
    await apiClient.delete(endpoints.feedback.workspaceItem(workspacePublicId, feedbackPublicId));
  }
}

export const feedbackWorkspaceService: FeedbackWorkspaceServiceContract =
  new FeedbackWorkspaceServiceImpl();
