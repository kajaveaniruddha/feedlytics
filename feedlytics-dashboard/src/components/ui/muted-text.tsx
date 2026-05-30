/**
 * MutedText — secondary body copy (auth footers, hints, page kickers).
 */
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils/cn";

const mutedTextVariants = cva("font-normal", {
  variants: {
    tone: {
      default: "text-sm text-navy-700 dark:text-white/80",
      subtle:
        "text-[13px] text-secondary-gray-600 dark:text-white/75",
      destructive: "text-base text-red-500 dark:text-red-400",
    },
    align: {
      start: "text-left",
      center: "text-center",
    },
  },
  defaultVariants: {
    tone: "default",
    align: "start",
  },
});

type MutedTextProps = React.ComponentProps<"p"> & VariantProps<typeof mutedTextVariants>;

function MutedText({ className, tone, align, ...props }: MutedTextProps) {
  return (
    <p
      data-slot="muted-text"
      className={cn(mutedTextVariants({ tone, align }), className)}
      {...props}
    />
  );
}

export { MutedText, mutedTextVariants };
