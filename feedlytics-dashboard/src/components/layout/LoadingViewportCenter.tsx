/**
 * Centers a spinner for full-route loading states.
 */
import * as React from "react";

import { Spinner } from "@/components/ui/spinner";

export type LoadingViewportCenterProps = {
  label: string;
};

export function LoadingViewportCenter({ label }: LoadingViewportCenterProps) {
  return (
    <div className="flex min-h-[50vh] flex-1 items-center justify-center">
      <Spinner size={32} aria-label={label} />
    </div>
  );
}
