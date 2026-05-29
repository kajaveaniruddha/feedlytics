import type { DailyFeedbackCount } from "@/features/workspace/types/overview.types";

/** 30-day sparkline curve for dashboard mocks (oldest → newest). */
export function buildRollingDailyCountsFixture(): DailyFeedbackCount[] {
  const counts = [2, 3, 2, 4, 3, 5, 4, 6, 5, 4, 7, 6, 5, 8, 7, 6, 9, 8, 7, 10, 9, 8, 11, 10, 9, 12, 11, 10, 8, 6];
  const end = new Date();
  end.setUTCHours(0, 0, 0, 0);

  return counts.map((count, index) => {
    const date = new Date(end);
    date.setUTCDate(end.getUTCDate() - (counts.length - 1 - index));
    return {
      date: date.toISOString().slice(0, 10),
      count,
    };
  });
}

export const workspaceRolling30DayFixture = {
  count: 124,
  previousPeriodCount: 110,
  changePercent: 12.45,
  dailyCounts: buildRollingDailyCountsFixture(),
};
