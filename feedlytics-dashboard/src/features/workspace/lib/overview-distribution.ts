import type { CategoryAnalyticsItem, SentimentCounts } from "@/features/workspace/types/overview.types";

/** Label for feedback not assigned to any configured category (API `otherCount` bucket). */
export const UNCATEGORIZED_FEEDBACK_LABEL = "Other";

export type SentimentKey = keyof SentimentCounts;

export type CategoryChartRow = {
  key: string;
  label: string;
  value: number;
  isUncategorizedBucket: boolean;
};

export function sentimentTotal(counts: SentimentCounts): number {
  return counts.positive + counts.negative + counts.neutral;
}

export function sentimentPercent(counts: SentimentCounts, key: SentimentKey): number {
  const total = sentimentTotal(counts);
  if (total <= 0) return 0;
  return Math.round((counts[key] / total) * 100);
}

export function categoryBarMax(rows: CategoryChartRow[]): number {
  if (rows.length === 0) return 1;
  return Math.max(...rows.map((row) => row.value), 1);
}

/** Renders workspace-defined category names exactly as returned by the API. */
export function displayCategoryLabel(name: string): string {
  const trimmed = name.trim();
  return trimmed.length > 0 ? trimmed : "—";
}

/**
 * Builds chart rows from API category items (any count, any name) plus optional uncategorized bucket.
 */
export function buildCategoryChartRows(
  items: CategoryAnalyticsItem[],
  otherCount = 0,
): CategoryChartRow[] {
  const rows: CategoryChartRow[] = [...items]
    .sort((a, b) => b.feedbackCount - a.feedbackCount)
    .map((item) => ({
      key: `category-${item.id}`,
      label: displayCategoryLabel(item.name),
      value: item.feedbackCount,
      isUncategorizedBucket: false,
    }));

  if (otherCount > 0) {
    rows.push({
      key: "uncategorized-feedback",
      label: UNCATEGORIZED_FEEDBACK_LABEL,
      value: otherCount,
      isUncategorizedBucket: true,
    });
  }

  return rows;
}
