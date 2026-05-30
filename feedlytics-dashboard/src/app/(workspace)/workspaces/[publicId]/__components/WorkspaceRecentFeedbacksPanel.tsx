"use client";

import { ArrowRightIcon, FrownIcon, LaughIcon, MehIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MutedText } from "@/components/ui/muted-text";
import { StarRatingRow } from "@/components/ui/star-rating-row";
import { routes } from "@/config/routes";
import { useWorkspaceFeedbacks } from "@/features/feedback/hooks/useWorkspaceFeedbacks";
import {
  formatFeedbackSentimentLabel,
  formatFeedbackSourceLabel,
  truncateFeedbackPreview,
} from "@/features/feedback/lib/feedback-display";
import type { FeedbackItemDto, FeedbackSentiment } from "@/features/feedback/types/workspace-feedback.types";
import { formatRelativeTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

const RECENT_FEEDBACKS_SIZE = 5;

const SENTIMENT_VISUAL: Record<
  FeedbackSentiment,
  { label: string; Icon: typeof LaughIcon; iconClass: string; bgClass: string; textClass: string }
> = {
  POSITIVE: {
    label: "Positive",
    Icon: LaughIcon,
    iconClass: "text-[#01B574]",
    bgClass: "bg-[#E6FAF5] dark:bg-[#01B574]/15",
    textClass: "text-[#01B574]",
  },
  NEGATIVE: {
    label: "Negative",
    Icon: FrownIcon,
    iconClass: "text-[#EE5D50]",
    bgClass: "bg-[#FEEFEE] dark:bg-[#EE5D50]/15",
    textClass: "text-[#EE5D50]",
  },
  NEUTRAL: {
    label: "Neutral",
    Icon: MehIcon,
    iconClass: "text-secondary-gray-600 dark:text-white/70",
    bgClass: "bg-secondary-gray-100 dark:bg-white/10",
    textClass: "text-secondary-gray-600 dark:text-white/70",
  },
};

export type WorkspaceRecentFeedbacksPanelProps = {
  workspacePublicId: string;
};

function RecentFeedbackRow({ feedback }: { feedback: FeedbackItemDto }) {
  const sentiment = feedback.sentiment;
  const visual = sentiment ? SENTIMENT_VISUAL[sentiment] : null;
  const Icon = visual?.Icon ?? MehIcon;

  return (
    <div className="flex items-center gap-3 rounded-[14px] px-3 py-3 transition-colors hover:bg-secondary-gray-100 dark:hover:bg-white/5">
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-full",
          visual?.bgClass ?? "bg-secondary-gray-100 dark:bg-white/10",
        )}
      >
        <Icon className={cn("size-[18px]", visual?.iconClass)} strokeWidth={2} aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold text-navy-900 dark:text-white">
          &ldquo;{truncateFeedbackPreview(feedback.content)}&rdquo;
        </p>
        <MutedText tone="subtle" className="text-[11px]">
          {formatFeedbackSourceLabel(feedback.sourceType)} · {formatRelativeTime(feedback.createdAt)}
        </MutedText>
      </div>
      <div className="shrink-0 text-right">
        <StarRatingRow rating={feedback.rating} />
        {sentiment ? (
          <p className={cn("mt-0.5 text-[10px] font-bold", visual?.textClass)}>
            {formatFeedbackSentimentLabel(sentiment)}
          </p>
        ) : (
          <MutedText tone="subtle" className="mt-0.5 text-[10px]">
            —
          </MutedText>
        )}
      </div>
    </div>
  );
}

function RecentFeedbacksSkeleton() {
  return (
    <div className="space-y-1">
      {Array.from({ length: RECENT_FEEDBACKS_SIZE }, (_, index) => (
        <div
          key={index}
          className="flex animate-pulse items-center gap-3 rounded-[14px] px-3 py-3"
          aria-hidden
        >
          <div className="size-10 rounded-full bg-secondary-gray-200 dark:bg-white/10" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-4/5 rounded bg-secondary-gray-200 dark:bg-white/10" />
            <div className="h-2.5 w-1/3 rounded bg-secondary-gray-200 dark:bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function WorkspaceRecentFeedbacksPanel({ workspacePublicId }: WorkspaceRecentFeedbacksPanelProps) {
  const { data, isPending, isError, error, refetch } = useWorkspaceFeedbacks(workspacePublicId, {
    page: 0,
    size: RECENT_FEEDBACKS_SIZE,
  });

  const feedbacks = data?.feedbacks ?? [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Feedbacks</CardTitle>
        <Link
          href={routes.workspaceFeedbacks(workspacePublicId)}
          className="inline-flex items-center gap-1 text-xs font-medium text-brand-500 hover:underline"
        >
          View all
          <ArrowRightIcon className="size-3.5" strokeWidth={2} aria-hidden />
        </Link>
      </CardHeader>
      <CardContent>
        {isPending ? <RecentFeedbacksSkeleton /> : null}
        {isError ? (
          <div className="space-y-3 py-2">
            <MutedText>{error.message}</MutedText>
            <Button type="button" size="sm" variant="outline" onClick={() => void refetch()}>
              Try again
            </Button>
          </div>
        ) : null}
        {!isPending && !isError && feedbacks.length === 0 ? (
          <MutedText className="py-4">No feedback yet.</MutedText>
        ) : null}
        {!isPending && !isError && feedbacks.length > 0 ? (
          <div className="space-y-0.5">
            {feedbacks.map((feedback) => (
              <RecentFeedbackRow key={feedback.publicId} feedback={feedback} />
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
