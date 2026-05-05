/**
 * Checkbox — reskinned to Horizon's `brandScheme`.
 * Horizon uses brand-scheme-500 (#422AFB) in light and brand-scheme-400 (#7551FF) in dark
 * for the checked state's background.
 */
"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils/cn";

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-5 shrink-0 items-center justify-center",
        "rounded-md border border-secondary-gray-100 bg-transparent",
        "transition-colors outline-none",
        "focus-visible:ring-2 focus-visible:ring-brand-500/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-red-500 aria-invalid:ring-2 aria-invalid:ring-red-500/20",
        "data-checked:border-brand-scheme-500 data-checked:bg-brand-scheme-500 data-checked:text-white",
        "dark:border-white-alpha-200",
        "dark:data-checked:border-brand-scheme-400 dark:data-checked:bg-brand-scheme-400",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
