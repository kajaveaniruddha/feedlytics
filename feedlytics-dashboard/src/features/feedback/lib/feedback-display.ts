import type { FeedbackSentiment, FeedbackSourceType } from "@/features/feedback/types/workspace-feedback.types";

const sourceTypeLabelMap: Record<FeedbackSourceType, string> = {
  API_KEY: "API",
  WIDGET: "Widget",
  CAMPAIGN: "Campaigns",
};

const sentimentLabelMap: Record<FeedbackSentiment, string> = {
  POSITIVE: "Positive",
  NEGATIVE: "Negative",
  NEUTRAL: "Neutral",
};

export function formatFeedbackSourceLabel(sourceType: FeedbackSourceType): string {
  return sourceTypeLabelMap[sourceType];
}

export function formatFeedbackSentimentLabel(sentiment: FeedbackSentiment): string {
  return sentimentLabelMap[sentiment];
}

export function truncateFeedbackPreview(content: string, maxLength = 56): string {
  const trimmed = content.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength - 1)}…`;
}
