import type { FeedbackItemDto } from "@/features/feedback/types/workspace-feedback.types";

const hoursAgo = (hours: number) => new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

/** First page slice for dashboard recent feedbacks panel. */
export const workspaceRecentFeedbackFixture: FeedbackItemDto[] = [
  {
    publicId: "60000000-0000-0000-0000-000000000001",
    sourceType: "WIDGET",
    content: "Love the new dashboard redesign!",
    rating: 5,
    submitterName: null,
    submitterEmail: null,
    sentiment: "POSITIVE",
    createdAt: hoursAgo(2),
    updatedAt: hoursAgo(2),
  },
  {
    publicId: "60000000-0000-0000-0000-000000000002",
    sourceType: "API_KEY",
    content: "Great product, would love dark mode.",
    rating: 4,
    submitterName: null,
    submitterEmail: null,
    sentiment: "POSITIVE",
    createdAt: hoursAgo(5),
    updatedAt: hoursAgo(5),
  },
  {
    publicId: "60000000-0000-0000-0000-000000000003",
    sourceType: "API_KEY",
    content: "Slow load on analytics page, 5+ sec.",
    rating: 2,
    submitterName: null,
    submitterEmail: null,
    sentiment: "NEGATIVE",
    createdAt: hoursAgo(24),
    updatedAt: hoursAgo(24),
  },
  {
    publicId: "60000000-0000-0000-0000-000000000004",
    sourceType: "WIDGET",
    content: "Great product, would love dark mode.",
    rating: 4,
    submitterName: null,
    submitterEmail: null,
    sentiment: "POSITIVE",
    createdAt: hoursAgo(24),
    updatedAt: hoursAgo(24),
  },
  {
    publicId: "60000000-0000-0000-0000-000000000005",
    sourceType: "WIDGET",
    content: "Slow load on analytics page, 5+ sec.",
    rating: 2,
    submitterName: null,
    submitterEmail: null,
    sentiment: "NEGATIVE",
    createdAt: hoursAgo(24),
    updatedAt: hoursAgo(24),
  }
];
