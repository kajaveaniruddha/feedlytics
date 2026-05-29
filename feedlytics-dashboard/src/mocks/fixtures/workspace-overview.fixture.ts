import type { WorkspaceOverviewAnalytics } from "@/features/workspace/types/overview.types";

import { workspaceRolling30DayFixture } from "./workspace-overview-rolling.fixture";

export const workspaceOverviewFixture: WorkspaceOverviewAnalytics = {
  publicId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  totalFeedbacks: 1247,
  averageRating: 4.6,
  topCategory: "Billing Issues",
  positiveSentimentPercentage: 72,
  sentimentCounts: {
    positive: 3,
    negative: 2,
    neutral: 1,
  },
  categories: {
    state: "READY",
    items: [
      { id: 6, name: "Billing Issues", feedbackCount: 2 },
      { id: 7, name: "feature_request", feedbackCount: 1 },
      { id: 8, name: "UI/UX", feedbackCount: 1 },
      { id: 9, name: "自定义分类", feedbackCount: 1 },
    ],
    otherCount: 2,
    message: null,
  },
  rolling30DayFeedbacks: workspaceRolling30DayFixture,
};

export const workspaceOverviewNotConfiguredFixture: WorkspaceOverviewAnalytics = {
  ...workspaceOverviewFixture,
  topCategory: "NONE",
  positiveSentimentPercentage: 0,
  sentimentCounts: {
    positive: 0,
    negative: 0,
    neutral: 0,
  },
  categories: {
    state: "NOT_CONFIGURED",
    items: null,
    otherCount: null,
    message: "No categories set. Please set the categories.",
  },
  rolling30DayFeedbacks: {
    count: 0,
    previousPeriodCount: 0,
    changePercent: 0,
    dailyCounts: [],
  },
};
