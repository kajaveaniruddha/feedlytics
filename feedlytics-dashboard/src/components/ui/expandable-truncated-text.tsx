"use client";

import * as React from "react";

import { cn } from "@/lib/utils/cn";

export type ExpandableTruncatedTextProps = {
  /** Full text to show; truncates when longer than `maxLength` until expanded. */
  text: string;
  /** Character cap before appending "..." when collapsed. Default 100. */
  maxLength?: number;
  className?: string;
};

/**
 * Generic read-more control: shows up to `maxLength` characters with "..." when collapsed;
 * click toggles full text (same interaction pattern as the legacy Next receiver table).
 */
function ExpandableTruncatedText({ text, maxLength = 100, className }: ExpandableTruncatedTextProps) {
  const [expanded, setExpanded] = React.useState(false);
  const needsToggle = text.length > maxLength;
  const collapsedPreview = `${text.slice(0, maxLength)}...`;
  const displayText = expanded || !needsToggle ? text : collapsedPreview;

  if (!needsToggle) {
    return (
      <p
        data-slot="expandable-truncated-text"
        className={cn(
          "text-sm break-words text-navy-700 dark:text-white",
          className,
        )}
      >
        {text}
      </p>
    );
  }

  return (
    <button
      type="button"
      data-slot="expandable-truncated-text"
      data-expanded={expanded}
      aria-expanded={expanded}
      title={expanded ? "Click to collapse" : "Click to show full text"}
      className={cn(
        "w-full cursor-pointer rounded-md text-left text-sm break-words text-navy-700 outline-none transition-colors",
        "hover:bg-secondary-gray-50 focus-visible:ring-2 focus-visible:ring-brand-500/30 dark:text-white dark:hover:bg-white/[0.04]",
        className,
      )}
      onClick={() => setExpanded((v) => !v)}
    >
      {displayText}
    </button>
  );
}

export { ExpandableTruncatedText };
