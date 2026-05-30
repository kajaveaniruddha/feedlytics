/**
 * Tight stack for a page kicker (muted) + display heading.
 */
import * as React from "react";

export type PageIntroProps = {
  kicker: React.ReactNode;
  title: React.ReactNode;
  /** Optional lead — use for readable contrast (`text-navy-700 dark:text-white/85`). */
  description?: React.ReactNode;
};

export function PageIntro({ kicker, title, description }: PageIntroProps) {
  return (
    <div className="flex flex-col gap-1">
      {kicker}
      {title}
      {description ? (
        <div className="mt-2 max-w-2xl text-base leading-relaxed text-navy-700 dark:text-white/85">
          {description}
        </div>
      ) : null}
    </div>
  );
}
