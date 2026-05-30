/**
 * Spinner — small inline loader used inside buttons and empty states.
 * Uses the Tailwind `animate-spin` keyframes and borrows the brand color by
 * default; consumers pass `className` to override size or color.
 */
import { Loader2Icon } from "lucide-react";

import { cn } from "@/lib/utils/cn";

type SpinnerProps = React.ComponentProps<"svg"> & {
  size?: number;
};

function Spinner({ className, size = 16, ...props }: SpinnerProps) {
  return (
    <Loader2Icon
      aria-hidden="true"
      data-slot="spinner"
      width={size}
      height={size}
      className={cn("animate-spin text-brand-500 dark:text-white", className)}
      {...props}
    />
  );
}

export { Spinner };
