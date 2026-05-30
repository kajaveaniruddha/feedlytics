/**
 * Card — reskinned to Horizon UI.
 * horizon-ui-chakra/src/theme/additions/card/card.js:
 *  - radius 20px, padding 20px, white in light / navy-800 in dark
 *  - shadow `14px 17px 40px 4px rgba(112, 144, 176, 0.08)` in light, none in dark
 */
import * as React from "react";

import { cn } from "@/lib/utils/cn";

function Card({
  className,
  interactive,
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm"; interactive?: boolean }) {
  return (
    <div
      data-slot="card"
      className={cn(
        "flex w-full flex-col gap-4 rounded-[20px] bg-surface p-5 text-sm text-navy-700 shadow-card dark:bg-navy-800 dark:text-white dark:shadow-none",
        interactive &&
          "cursor-pointer transition-all duration-200 ease-out hover:-translate-y-[3px] hover:shadow-[14px_17px_40px_4px_rgba(112,144,176,0.16)] dark:hover:shadow-none",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1", className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-heading text-base font-bold leading-snug text-navy-700 dark:text-white",
        className,
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted dark:text-secondary-gray-600", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("flex flex-col", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center", className)}
      {...props}
    />
  );
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
