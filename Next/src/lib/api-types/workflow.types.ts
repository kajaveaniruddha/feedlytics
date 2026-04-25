import type { BaseApiResponse } from "./common.types";

export interface GetWorkflowsResponse extends BaseApiResponse {
  workflows: Record<
    string,
    {
      id: string;
      groupName: string;
      webhookUrl: string;
      notifyCategories: string[];
      isActive: boolean;
    }[]
  >;
}

export interface CreateWorkflowResponse extends BaseApiResponse {}
export interface UpdateWorkflowResponse extends BaseApiResponse {}
export interface DeleteWorkflowResponse extends BaseApiResponse {}
