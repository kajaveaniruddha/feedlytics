/**
 * Star + formatted rating, or an em dash when absent.
 */
import * as React from "react";
import { StarIcon } from "lucide-react";

import { formatRating } from "@/lib/utils/format";

export type RatingValueProps = {
  value: number | null;
};

export function RatingValue({ value }: RatingValueProps) {
  if (value == null) {
    return (
      <div className="flex items-center gap-1.5 text-xs font-semibold text-navy-700 dark:text-white">
        <span className="text-xs font-medium text-secondary-gray-600 dark:text-secondary-gray-600" aria-hidden>
          —
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-xs font-semibold text-navy-700 dark:text-white">
      <StarIcon className="size-3 shrink-0 fill-orange-500 text-orange-500" strokeWidth={0} aria-hidden />
      <span>{formatRating(value)}</span>
    </div>
  );
}
