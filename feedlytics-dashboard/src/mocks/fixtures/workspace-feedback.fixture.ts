import type { FeedbackItemDto } from "@/features/feedback/types/workspace-feedback.types";

export const workspaceFeedbackFixture: FeedbackItemDto[] = [
  {
    publicId: "50000000-0000-0000-0000-000000000001",
    sourceType: "WIDGET",
    content: "Checkout loading is slow on mobile Safari when I open the cart.",
    rating: 2,
    submitterName: "Alex M.",
    submitterEmail: "alex@example.com",
    sentiment: "NEGATIVE",
    createdAt: "2026-04-14T08:30:00.000Z",
    updatedAt: "2026-04-14T08:30:00.000Z",
  },
  {
    publicId: "50000000-0000-0000-0000-000000000002",
    sourceType: "API_KEY",
    content: "Great onboarding. It only took me five minutes to send my first campaign.",
    rating: 5,
    submitterName: null,
    submitterEmail: null,
    sentiment: "POSITIVE",
    createdAt: "2026-04-15T12:00:00.000Z",
    updatedAt: "2026-04-15T12:00:00.000Z",
  },
  {
    publicId: "50000000-0000-0000-0000-000000000003",
    sourceType: "WIDGET",
    content:
      "Please add CSV export for weekly reports. We need it for executive review meetings and the leadership team has been asking for a downloadable format for several quarters now.",
    rating: 4,
    submitterName: null,
    submitterEmail: "reports@example.com",
    sentiment: "NEUTRAL",
    createdAt: "2026-04-16T16:45:00.000Z",
    updatedAt: "2026-04-16T16:45:00.000Z",
  },
];
