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

