/**
 * Vertical rhythm primitive for forms and stacked sections.
 */
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils/cn";

const stackVariants = cva("flex flex-col", {
  variants: {
    gap: {
      none: "gap-0",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
    },
  },
  defaultVariants: {
    gap: "md",
  },
});

export type StackProps = React.ComponentProps<"div"> & VariantProps<typeof stackVariants>;

function Stack({ className, gap, ...props }: StackProps) {
  return <div data-slot="stack" className={cn(stackVariants({ gap }), className)} {...props} />;
}

export { Stack, stackVariants };
