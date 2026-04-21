import type { SelectFeedback } from "@/db/models/feedback";
import type { SelectChatGroup } from "@/db/models/workflows";

export interface BaseApiResponse {
  success: boolean;
  message?: string;
}

export interface GetMessagesResponse extends BaseApiResponse {
  messages: SelectFeedback[];
  messagesFound: number;
}

export interface DeleteMessagesResponse extends BaseApiResponse {}

export interface GetAnalyticsResponse extends BaseApiResponse {
  userDetails: { name: string | null; messageCount: number | null; maxMessages: number | null };
  categoryCounts: { category: string; count: number }[];
  sentimentCounts: { positive: number; negative: number; neutral: number };
  ratingsCount: { rating: number; count: number }[];
}

export interface GetSentimentCountsResponse extends BaseApiResponse {
  counts: { positive: number; negative: number; neutral: number };
}

export interface GetUserDetailsResponse extends BaseApiResponse {
  userDetails: {
    name: string | null;
    username: string;
    avatar_url: string | null;
    introduction: string | null;
    questions: string[] | null;
    textColor: string | null;
    bgColor: string | null;
    collectName: boolean;
    collectEmail: boolean;
  };
}

export interface GetProjectDetailsResponse extends BaseApiResponse {
  messageCount: number | null;
  maxMessages: number | null;
  maxWorkflows: number | null;
  billingPeriodStart: Date | null;
  billingPeriodEnd: Date | null;
  userDetails: {
    name: string | null;
    userTier: string | null;
    avatar_url: string | null;
    bgColor: string | null;
    collectEmail: boolean;
    collectName: boolean;
    textColor: string | null;
  };
}

export interface UpdateUserDataResponse extends BaseApiResponse {}

export interface GetAcceptMessagesResponse extends BaseApiResponse {
  isAcceptingMessages: boolean;
}

export interface UpdateAcceptMessagesResponse extends BaseApiResponse {}

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

export interface GetBillingResponse extends BaseApiResponse {
  userTier: string | null;
  messageCount: number | null;
  maxMessages: number | null;
  maxWorkflows: number | null;
  billingPeriodStart: Date | null;
  billingPeriodEnd: Date | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  workflowCount: number;
  periodFeedbackCount: number;
}

export interface CreateCheckoutSessionResponse extends BaseApiResponse {
  url: string;
}

export interface SendMessageResponse extends BaseApiResponse {
  messageCount?: number;
}

export interface GetUserFormDetailsResponse extends BaseApiResponse {
  userDetails: {
    name: string | null;
    introduction: string | null;
    questions: string[] | null;
    avatar_url: string | null;
    collectName: boolean;
    collectEmail: boolean;
  };
}

export interface CheckUsernameResponse extends BaseApiResponse {}
