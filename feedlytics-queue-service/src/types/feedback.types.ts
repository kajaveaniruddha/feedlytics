export interface FeedbackJobData {
  feedbackId: number;
  content: string;
  workspaceCategoryNames: string[];
  callbackBaseUrl: string;
  internalAuthToken: string;
  notificationWebhooks: string[];
  rating: number;
  submittedAtEpochMs: number;
}

export interface SentimentAnalysisResult {
  overall_sentiment: "positive" | "neutral" | "negative";
  sentiment_confidence: number;
  categories: { name: string; confidence?: number }[];
}
