import type { SelectFeedback } from "@/db/models/feedback";
import type { BaseApiResponse } from "./common.types";

export interface GetMessagesResponse extends BaseApiResponse {
  messages: SelectFeedback[];
  messagesFound: number;
}

export interface DeleteMessagesResponse extends BaseApiResponse {}

export interface SendMessageResponse extends BaseApiResponse {
  messageCount?: number;
}
