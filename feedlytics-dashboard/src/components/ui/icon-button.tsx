/**
 * IconButton — thin wrapper on Button for icon-only controls. Pre-sets
 * variant / size for sidebar and navbar icons so features never spell those
 * props manually.
 */
import * as React from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { VariantProps } from "class-variance-authority";

type IconButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "variant" | "size"
> & {
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: "icon" | "icon-sm" | "icon-lg";
  label: string;
};

function IconButton({
  className,
  variant = "ghost",
  size = "icon",
  label,
  children,
  ...props
}: IconButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      aria-label={label}
      className={cn("rounded-full", className)}
      {...props}
    >
      {children}
    </Button>
  );
}

export { IconButton };
