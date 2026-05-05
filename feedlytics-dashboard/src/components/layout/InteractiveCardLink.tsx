import Link from "next/link";
import * as React from "react";

import { cn } from "@/lib/utils/cn";

export type InteractiveCardLinkProps = Omit<React.ComponentProps<typeof Link>, "className"> & {
  className?: string;
};

/**
 * Next `Link` styled for interactive `Card` tiles (focus ring + no underline).
 */
export function InteractiveCardLink({ className, children, ...props }: InteractiveCardLinkProps) {
  return (
    <Link
      className={cn(
        "block w-full rounded-[20px] no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
