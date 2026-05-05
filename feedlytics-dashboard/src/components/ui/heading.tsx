/**
 * Heading — semantic levels (primary / secondary / tertiary). All typography
 * that previously lived on global `h1–h3` base rules lives here instead.
 */
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils/cn";

const headingVariants = cva("font-heading", {
  variants: {
    variant: {
      primary:
        "text-4xl font-extrabold leading-tight text-navy-700 dark:text-white",
      secondary:
        "max-w-md text-balance text-4xl font-bold leading-tight text-white",
      tertiary: "text-xl font-semibold text-navy-700 dark:text-white",
      /** Picker / marketing page title (~30px). */
      display:
        "text-[30px] font-extrabold leading-tight text-navy-700 dark:text-white",
      /** Dense card title (workspace tiles, settings cards). */
      cardTitle: "text-lg font-bold leading-snug text-navy-700 dark:text-white",
      /** Workspace dashboard page title (~24px / text-2xl). */
      workspacePageTitle:
        "text-2xl font-bold leading-tight text-navy-700 dark:text-white",
      /** Large KPI figure on dashboard stat cards (~24px / text-2xl). */
      kpi: "text-2xl font-extrabold leading-tight tracking-tight text-navy-700 tabular-nums dark:text-white",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

const defaultTagForVariant = {
  primary: "h1",
  secondary: "h2",
  tertiary: "h3",
  display: "h1",
  cardTitle: "h2",
  workspacePageTitle: "h1",
  kpi: "p",
} as const;

export type HeadingProps = {
  /** Page / section / card title */
  children: React.ReactNode;
  /** Optional strapline; omitted nodes are not rendered */
  subheading?: React.ReactNode;
  className?: string;
  /** Override default heading element (h1 / h2 / h3) for outline */
  as?: React.ElementType;
} & VariantProps<typeof headingVariants>;

function Heading({
  variant = "primary",
  subheading,
  className,
  as,
  children,
}: HeadingProps) {
  const v = variant ?? "primary";
  const Tag = (as ?? defaultTagForVariant[v]) as React.ElementType;
  const showSub =
    subheading != null && subheading !== "" && !(typeof subheading === "boolean" && !subheading);

  const title = (
    <Tag data-slot="heading-title" className={cn(headingVariants({ variant: v }), className)}>
      {children}
    </Tag>
  );

  const sub = showSub ? (
    <p
      data-slot="heading-subheading"
      className="text-base text-subtle dark:text-secondary-gray-600"
    >
      {subheading}
    </p>
  ) : null;

  if (v === "primary") {
    return (
      <header data-slot="heading" className="flex flex-col gap-2">
        {title}
        {sub}
      </header>
    );
  }

  if (v === "display" || v === "cardTitle" || v === "kpi" || v === "workspacePageTitle") {
    return title;
  }

  if (showSub) {
    return (
      <div data-slot="heading" className="flex flex-col gap-2">
        {title}
        {sub}
      </div>
    );
  }

  return title;
}

export { Heading, headingVariants };
