/**
 * Input — reskinned to Horizon UI.
 *
 * Variants mirror horizon-ui-chakra/src/theme/components/input.js:
 *  - main  transparent in light / navy-800 in dark; secondary-gray-100 border; 16px radius; 20px padding
 *  - auth  transparent both modes; Horizon's auth-input-border-dark in dark mode
 *  - search  borderless (used inside search containers)
 *
 * Placeholder color and weight match Horizon (secondary-gray-600, weight 400).
 */
import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

const inputVariants = cva(
  [
    "w-full min-w-0 font-medium outline-none transition-colors",
    "rounded-[16px]",
    "placeholder:text-secondary-gray-600 placeholder:font-normal",
    "disabled:cursor-not-allowed disabled:opacity-60",
    "aria-invalid:border-red-500 aria-invalid:ring-2 aria-invalid:ring-red-500/20",
    "focus-visible:border-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500/20",
  ].join(" "),
  {
    variants: {
      variant: {
        main: [
          "border border-secondary-gray-100 bg-transparent text-navy-700",
          "dark:border-white-alpha-100 dark:bg-navy-800 dark:text-white",
        ].join(" "),
        auth: [
          "border border-secondary-gray-100 bg-transparent text-navy-700",
          "dark:border-[color:var(--auth-input-border-dark)] dark:bg-transparent dark:text-white",
        ].join(" "),
        search: "border-0 bg-transparent text-navy-700 dark:text-white",
        /** Inside pill search shells: no extra height, no focus ring (shell handles chrome). */
        searchInset:
          "h-auto min-h-0 rounded-none border-0 bg-transparent px-0 py-0 text-xs text-navy-700 shadow-none focus-visible:border-transparent focus-visible:ring-0 dark:text-white",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-4 text-sm",
        lg: "h-[50px] px-5 text-sm",
      },
    },
    defaultVariants: {
      variant: "auth",
      size: "lg",
    },
  },
);

type InputProps = Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants>;

function Input({ className, variant, size, type, ...props }: InputProps) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(inputVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Input, inputVariants };
export type { InputProps };
