import { ReactNode } from "react";
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
  userDetails?: {
    name: string;
    userTier: "free" | "premium";
    avatar_url: string;
    bgColor: string;
    collectEmail: boolean; // changed from string to boolean
    collectName: boolean; // changed from string to boolean
    textColor: string;
  };
}

export interface userDetailsType {
  name: string;
  userTier: "free" | "premium";
  username: string;
  avatar_url: string;
  introduction: string;
  questions: string[];
  bgColor: string;
  textColor: string;
  collectName: boolean;
  collectEmail: boolean;
}

export interface ApiResponseUserDetails {
  userDetails: userDetailsType;
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

export interface WorkflowsListProps {
  provider: "googlechat" | "slack";
  title: string;
  icon: ReactNode;
  emptyListText: string;
  emptyListSubtext: string;
  workflows: IWorkFlows[];
  onRefresh: () => void;
  onEdit: (workflow: IWorkFlows) => void;
}

export interface ProviderConfig {
  id: number;
  provider: "googlechat" | "slack";
  title: string;
  icon: ReactNode;
  emptyListText: string;
  emptyListSubtext: string;
}
