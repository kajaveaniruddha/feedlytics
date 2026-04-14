import type { SelectFeedback } from "@/db/models/feedback";
import type { SelectChatGroup } from "@/db/models/workflows";

export interface BaseApiResponse {
  success: boolean;
  message: string;
}

// --- Analytics ---
export interface GetAnalyticsResponse extends BaseApiResponse {
  userDetails: { name: string | null; messageCount: number | null; maxMessages: number | null };
  categoryCounts: { category: string; count: number }[];
  sentimentCounts: { positive: number; negative: number; neutral: number };
  ratingsCount: { rating: number; count: number }[];
}

export interface GetSentimentCountsResponse extends BaseApiResponse {
  counts: { positive: number; negative: number; neutral: number };
}

// --- Messages ---
export interface GetMessagesResponse extends BaseApiResponse {
  messages: SelectFeedback[];
  totalPages: number;
  totalCount: number;
  currentPage: number;
}

export interface SendMessageRequest {
  username: string;
  stars: number;
  content: string;
  email?: string;
  name?: string;
}

export interface SendMessageResponse extends BaseApiResponse {
  messageCount: number;
}

export interface DeleteMessagesRequest {
  messageIds: string[];
}

export type DeleteMessagesResponse = BaseApiResponse;

// --- User ---
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

export interface UpdateUserDataRequest {
  name: string;
  username: string;
  avatar_url: string;
  introduction?: string;
  questions: string[];
  bg_color: string;
  text_color: string;
  collect_info: { name: boolean; email: boolean };
}

export type UpdateUserDataResponse = BaseApiResponse;

export interface CheckUsernameResponse extends BaseApiResponse {}

// --- Workflows ---
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

export interface CreateWorkflowRequest {
  provider: "googlechat" | "slack";
  groupName: string;
  webhookUrl: string;
  notifyCategories: string[];
  isActive?: boolean;
}

export type CreateWorkflowResponse = BaseApiResponse;
export type UpdateWorkflowResponse = BaseApiResponse;
export type DeleteWorkflowResponse = BaseApiResponse;

// --- Billing ---
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

export interface CreateCheckoutSessionRequest {
  plan: "pro" | "business";
  interval: "monthly" | "yearly";
}

export interface CreateCheckoutSessionResponse {
  url: string;
}

// --- Accept Messages ---
export interface GetAcceptMessagesResponse extends BaseApiResponse {
  isAcceptingMessages: boolean;
}

export type UpdateAcceptMessagesResponse = BaseApiResponse;

// --- Project ---
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

// --- Widget / Public ---
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

export interface GetWidgetSettingsResponse {
  bg_color: string;
  text_color: string;
  collect_info: { name: boolean; email: boolean };
}
