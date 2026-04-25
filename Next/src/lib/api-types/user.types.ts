import type { BaseApiResponse } from "./common.types";

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
