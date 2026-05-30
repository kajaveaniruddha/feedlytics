/**
 * Button — reskinned to Horizon UI.
 *
 * Variants mirror horizon-ui-chakra/src/theme/components/button.js:
 *  - brand       bg brand-500 light / brand-400 dark, hover brand-600 / brand-400, white text
 *  - darkBrand   bg brand-900 light / brand-400 dark, white text
 *  - lightBrand  bg brand-lavender (#F2EFFF) / white-alpha-100, brand-500 / white text
 *  - light       bg secondary-gray-300 / white-alpha-100, navy-700 / white text (Google button)
 *  - outline     transparent with border
 *  - ghost       transparent, hover soft
 *  - action / setup  pill (50px radius) variants used by Horizon for filter chips
 *  - cta         landing “Get started now” pill: navy fill + hover/active lift
 *                shadows (Horizon UI boilerplate / marketing CTAs)
 *  - bannerCta   white pill on gradient banners (workspace updates carousel CTA)
 *  - destructive uses Horizon red-500
 *
 * Most variants use rounded-[16px] by default — Horizon Chakra baseStyle.
 * `cta` uses rounded-full (full pill) like the marketing site primary CTA.
 */
import * as React from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  [
    "group/button inline-flex shrink-0 items-center justify-center gap-2",
    "rounded-[16px] font-medium whitespace-nowrap",
    "transition-all duration-200 ease-out",
    "outline-none select-none",
    "focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  ].join(" "),
  {
    variants: {
      variant: {
        brand: [
          "bg-brand-500 text-white",
          "hover:bg-brand-600",
          "dark:bg-brand-400 dark:hover:bg-brand-400",
        ].join(" "),
        darkBrand: [
          "bg-brand-900 text-white",
          "hover:bg-brand-800",
          "dark:bg-brand-400 dark:hover:bg-brand-400",
        ].join(" "),
        lightBrand: [
          "bg-brand-lavender text-brand-500",
          "hover:bg-secondary-gray-400",
          "dark:bg-white-alpha-100 dark:text-white dark:hover:bg-white-alpha-200",
        ].join(" "),
        light: [
          "bg-secondary-gray-300 text-navy-700",
          "hover:bg-horizon-gray-200",
          "dark:bg-white-alpha-200 dark:text-white dark:hover:bg-white-alpha-300",
        ].join(" "),
        outline: [
          "border border-secondary-gray-100 bg-transparent text-navy-700",
          "hover:bg-secondary-gray-100",
          "dark:border-white-alpha-200 dark:text-white dark:hover:bg-white-alpha-100",
        ].join(" "),
        ghost: [
          "bg-transparent text-navy-700",
          "hover:bg-secondary-gray-100",
          "dark:text-white dark:hover:bg-white-alpha-100",
        ].join(" "),
        action: [
          "rounded-[50px] bg-secondary-gray-300 text-brand-500 font-medium",
          "hover:bg-secondary-gray-200",
          "dark:bg-brand-400 dark:text-white dark:hover:bg-brand-400",
        ].join(" "),
        setup: [
          "rounded-[50px] border border-secondary-gray-400 bg-transparent text-navy-700 font-medium",
          "hover:bg-secondary-gray-100",
          "dark:border-transparent dark:bg-brand-400 dark:text-white dark:hover:bg-brand-400",
        ].join(" "),
        /** Landing hero / “Get started now” — deep surface + curved pill + shadow depth on press */
        cta: [
          "rounded-full border-0 bg-navy-900 text-white font-medium",
          "shadow-none transition-[box-shadow,background-color] duration-200 ease-out",
          "hover:bg-navy-800 hover:shadow-[var(--shadow-cta-hover)]",
          "active:bg-navy-900 active:shadow-[var(--shadow-cta-active)]",
          "dark:bg-white/20 dark:text-white dark:backdrop-blur-sm",
          "dark:hover:bg-white/30 dark:hover:shadow-[var(--shadow-cta-hover)]",
          "dark:active:bg-white/40 dark:active:shadow-[var(--shadow-cta-active)]",
        ].join(" "),
        destructive: [
          "bg-red-500 text-white",
          "hover:bg-red-600",
        ].join(" "),
        link: "bg-transparent text-brand-500 underline-offset-4 hover:underline dark:text-white",
        /** White pill on purple gradient — workspace banner / carousel CTA */
        bannerCta: [
          "rounded-full border-0 bg-white px-6 py-2 text-sm font-bold text-brand-500 shadow-none",
          "hover:shadow-md",
          "dark:bg-white dark:text-brand-500",
        ].join(" "),
      },
      size: {
        sm: "h-9 px-4 text-xs",
        md: "h-11 px-5 text-sm",
        lg: "h-[50px] px-6 text-sm",
        xl: "h-14 px-8 text-base",
        icon: "size-10 p-0",
        "icon-sm": "size-8 p-0",
        "icon-lg": "size-12 p-0",
      },
    },
    defaultVariants: {
      variant: "brand",
      size: "lg",
    },
    compoundVariants: [
      {
        variant: "bannerCta",
        class: "!h-auto min-h-0",
      },
    ],
  },
);

function spinnerClassForButtonVariant(
  v: VariantProps<typeof buttonVariants>["variant"],
): string {
  switch (v) {
    case "brand":
    case "darkBrand":
    case "destructive":
    case "cta":
      return "text-white";
    case "bannerCta":
      return "text-brand-500";
    case "link":
      return "text-brand-500 dark:text-white";
    default:
      return "text-current";
  }
}

export type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    /** Shows inline spinner and disables the button */
    loading?: boolean;
    /** Leading content (e.g. icon); replaced by spinner while `loading` */
    leading?: React.ReactNode;
  };

function Button({
  className,
  variant,
  size,
  loading = false,
  leading,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const isBusy = Boolean(loading);
  const spinCls = spinnerClassForButtonVariant(variant);

  const startSlot = isBusy ? (
    <Spinner
      aria-hidden
      className={cn("size-4 shrink-0", spinCls)}
      size={16}
    />
  ) : leading != null ? (
    leading
  ) : null;

  return (
    <ButtonPrimitive
      {...props}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={Boolean(disabled) || isBusy}
      aria-busy={isBusy || undefined}
    >
      {startSlot}
      {children}
    </ButtonPrimitive>
  );
}

export { Button, buttonVariants };
