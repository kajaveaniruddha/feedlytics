import { StarIcon } from "lucide-react";

import { cn } from "@/lib/utils/cn";

export type StarRatingRowProps = {
  rating: number;
  maxStars?: number;
  className?: string;
};

export function StarRatingRow({ rating, maxStars = 5, className }: StarRatingRowProps) {
  const safeRating = Math.max(0, Math.min(maxStars, Math.round(rating)));

  return (
    <div className={cn("flex justify-end gap-px", className)} aria-label={`${safeRating} out of ${maxStars} stars`}>
      {Array.from({ length: maxStars }, (_, index) => {
        const filled = index < safeRating;
        return (
          <StarIcon
            key={index}
            className={cn(
              "size-[11px]",
              filled
                ? "fill-orange-500 text-orange-500"
                : "fill-none text-secondary-gray-300 dark:text-white/25",
            )}
            strokeWidth={filled ? 0 : 1.5}
            aria-hidden
          />
        );
      })}
    </div>
  );
}
