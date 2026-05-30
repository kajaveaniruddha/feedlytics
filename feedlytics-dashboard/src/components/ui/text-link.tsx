/**
 * TextLink — inline Next.js links with brand styling (auth forms, footers).
 */
import Link from "next/link";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

const textLinkVariants = cva(
  "font-medium text-brand-500 underline-offset-4 transition-colors hover:underline dark:text-white",
  {
    variants: {
      variant: {
        inline: "text-base",
        inlineSm: "text-sm",
      },
    },
    defaultVariants: {
      variant: "inline",
    },
  },
);

type TextLinkProps = Omit<React.ComponentProps<typeof Link>, "className"> &
  VariantProps<typeof textLinkVariants> & {
    className?: string;
  };

const TextLink = React.forwardRef<HTMLAnchorElement, TextLinkProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <Link
        ref={ref}
        data-slot="text-link"
        className={cn(textLinkVariants({ variant }), className)}
        {...props}
      />
    );
  },
);
TextLink.displayName = "TextLink";

export { TextLink, textLinkVariants };
