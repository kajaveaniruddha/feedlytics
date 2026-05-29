"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MutedText } from "@/components/ui/muted-text";
import { SegmentedDistributionBar } from "@/components/ui/segmented-distribution-bar";
import { Stack } from "@/components/ui/stack";
import {
  sentimentPercent,
  sentimentTotal,
  type SentimentKey,
} from "@/features/workspace/lib/overview-distribution";
import type { SentimentCounts } from "@/features/workspace/types/overview.types";

export type WorkspaceSentimentBreakdownPanelProps = {
  sentimentCounts: SentimentCounts;
};

const sentimentLegend: Array<{
  key: SentimentKey;
  label: string;
  dotClass: string;
  barClass: string;
}> = [
  { key: "positive", label: "Positive", dotClass: "bg-[#01B574]", barClass: "bg-[#01B574]" },
  { key: "negative", label: "Negative", dotClass: "bg-[#E31A1A]", barClass: "bg-[#E31A1A]" },
  { key: "neutral", label: "Neutral", dotClass: "bg-secondary-gray-500", barClass: "bg-secondary-gray-500" },
];

export function WorkspaceSentimentBreakdownPanel({ sentimentCounts }: WorkspaceSentimentBreakdownPanelProps) {
  const total = sentimentTotal(sentimentCounts);

  return (
    <Card className="h-full">
      <CardHeader className="space-y-1">
        <CardTitle>Sentiment breakdown</CardTitle>
        <MutedText tone="subtle">Based on AI-analyzed feedback</MutedText>
      </CardHeader>
      <CardContent>
        {total <= 0 ? (
          <MutedText>No analyzed feedback yet.</MutedText>
        ) : (
          <Stack gap="md">
            <SegmentedDistributionBar
              segments={sentimentLegend.map((item) => ({
                id: item.key,
                label: item.label,
                value: sentimentCounts[item.key],
                colorClass: item.barClass,
              }))}
              aria-label={`Sentiment distribution: ${total} analyzed feedback items`}
            />

            <div className="space-y-2">
              {sentimentLegend.map((item) => {
                const count = sentimentCounts[item.key];
                const percent = sentimentPercent(sentimentCounts, item.key);
                return (
                  <div key={item.key} className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className={`size-2.5 shrink-0 rounded-full ${item.dotClass}`} aria-hidden />
                      <span className="text-xs font-semibold text-navy-900 dark:text-white">{item.label}</span>
                    </div>
                    <MutedText tone="subtle" className="shrink-0 text-xs">
                      {count.toLocaleString()} ({percent}%)
                    </MutedText>
                  </div>
                );
              })}
            </div>

            <MutedText tone="subtle" className="text-xs">
              {total.toLocaleString()} analyzed feedback item{total === 1 ? "" : "s"}
            </MutedText>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
