export interface Message {
  stars: number;
  content: string;
  createdAt: Date;
  sentiment: string;
  category: string[];
}

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessage?: boolean;
  messageCount?: number;
  maxMessages?: number;
  maxWorkflows?: number;
  messages?: Array<Message>;
  totalPages?: number;
  messagesFound?: number;
}

export interface userDetailsType {
  name: string;
  introduction: string;
  questions: string[];
}

export interface ApiResponseUserDetails {
  userDetails: userDetailsType;
}

export interface SlackChannel {
  id: number;
  channelName: string;
  webhookUrl: string;
  isActive: boolean;
  notifyCategories: string[];
}

export interface GoogleChatSpace {
  id: number;
  spaceName: string;
  webhookUrl: string;
  isActive: boolean;
  notifyCategories: string[];
}

export interface IWorkFlows {
  id: number;
  provider: "googlechat" | "slack";
  groupName: string;
  webhookUrl: string;
  isActive: boolean;
  notifyCategories: string[];
}

export type IAuthType = "signup" | "login";
