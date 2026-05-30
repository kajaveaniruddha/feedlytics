"use client";

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";

import { cn } from "@/lib/utils/index";

function Separator({ className, orientation = "horizontal", ...props }: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        "shrink-0",
        orientation === "vertical"
          ? "h-auto w-0 self-stretch border-l border-secondary-gray-500/30 dark:border-white-alpha-200"
          : "h-0 w-full border-t border-secondary-gray-500/30 dark:border-white-alpha-200",
        className,
      )}
      {...props}
    />
  );
}

export { Separator };
