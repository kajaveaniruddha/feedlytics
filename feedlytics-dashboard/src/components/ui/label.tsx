/**
 * Label — Horizon-styled. Maps to `fontSize 14 / fontWeight 500 / color navy-700`
 * per the auth view.
 */
"use client";

import * as React from "react";

import { cn } from "@/lib/utils/cn";

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-1 text-sm font-medium leading-none text-navy-700 select-none",
        "dark:text-white",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
