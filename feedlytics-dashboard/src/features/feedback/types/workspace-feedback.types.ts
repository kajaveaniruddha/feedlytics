export type FeedbackSourceType = "API_KEY" | "WIDGET" | "CAMPAIGN";

export type FeedbackSentiment = "POSITIVE" | "NEGATIVE" | "NEUTRAL";

export type FeedbackItemDto = {
  publicId: string;
  sourceType: FeedbackSourceType;
  content: string;
  rating: number;
  submitterName: string | null;
  submitterEmail: string | null;
  /** Present when AI analysis exists for this feedback. */
  sentiment: FeedbackSentiment | null;
  createdAt: string;
  updatedAt: string;
};

export type FeedbackListResponseDto = {
  feedbacks: FeedbackItemDto[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};
