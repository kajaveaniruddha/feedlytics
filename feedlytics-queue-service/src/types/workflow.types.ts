export interface WorkflowNotificationMessage {
  stars: number;
  content: string;
  sentiment: string;
  category: string[];
  createdAt: Date;
}

export interface WorkflowNotificationPayload {
  webhookUrl: string;
  message: WorkflowNotificationMessage;
}
