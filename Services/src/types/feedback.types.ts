export type FeedbackCategory =
  | "bug"
  | "request"
  | "praise"
  | "complaint"
  | "suggestion"
  | "question"
  | "other";

export interface FeedbackJobData {
  userId: number;
  stars: number;
  content: string;
  email?: string;
  name?: string;
  createdAt?: string | Date;
}

export interface SentimentAnalysisResult {
  overall_sentiment: "positive" | "neutral" | "negative";
  feedback_classification: FeedbackCategory[];
}
