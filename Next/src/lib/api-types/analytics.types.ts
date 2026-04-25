import type { BaseApiResponse } from "./common.types";

export interface GetAnalyticsResponse extends BaseApiResponse {
  userDetails: { name: string | null; messageCount: number | null; maxMessages: number | null };
  categoryCounts: { category: string; count: number }[];
  sentimentCounts: { positive: number; negative: number; neutral: number };
  ratingsCount: { rating: number; count: number }[];
}

export interface GetSentimentCountsResponse extends BaseApiResponse {
  counts: { positive: number; negative: number; neutral: number };
}
