/**
 * Mirrors Kotlin `FeedbackOverviewAnalyticsResponse` and nested DTOs.
 */
export type SentimentCounts = {
  positive: number;
  negative: number;
  neutral: number;
};

export type CategoryAnalyticsState = "READY" | "NOT_CONFIGURED";

export type CategoryAnalyticsItem = {
  id: number;
  name: string;
  feedbackCount: number;
};

export type CategoryAnalyticsBreakdown = {
  state: CategoryAnalyticsState;
  items: CategoryAnalyticsItem[] | null;
  otherCount: number | null;
  message: string | null;
};

export type DailyFeedbackCount = {
  date: string;
  count: number;
};

export type RollingFeedbackTrend = {
  count: number;
  previousPeriodCount: number;
  changePercent: number;
  dailyCounts: DailyFeedbackCount[];
};

export type WorkspaceOverviewAnalytics = {
  publicId: string;
  totalFeedbacks: number;
  averageRating: number;
  topCategory: string;
  positiveSentimentPercentage: number;
  sentimentCounts: SentimentCounts;
  categories: CategoryAnalyticsBreakdown;
  rolling30DayFeedbacks: RollingFeedbackTrend;
};

export type WorkspaceOverviewAnalyticsResponse = {
  success?: boolean;
} & WorkspaceOverviewAnalytics;
