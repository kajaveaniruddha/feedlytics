/**
 * Mirrors Kotlin `FeedbackOverviewAnalyticsResponse`.
 */
export type WorkspaceOverviewAnalytics = {
  publicId: string;
  totalFeedbacks: number;
  averageRating: number;
  topCategory: string;
  positiveSentimentPercentage: number;
};

export type WorkspaceOverviewAnalyticsResponse = {
  success?: boolean;
} & WorkspaceOverviewAnalytics;
