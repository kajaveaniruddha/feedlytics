import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import {
  brandAccentGradientFill,
  brandAccentOnGradientText,
} from "@/lib/ui/brand-accent-gradient"
import { cn } from "@/lib/utils/index"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
        workspacePlanFree:
          "h-6 border-0 bg-secondary-gray-300 px-3 text-[11px] font-bold text-secondary-gray-700 dark:bg-navy-700 dark:text-secondary-gray-600",
        workspacePlanPro:
          "h-6 border-0 bg-brand-100 px-3 text-[11px] font-bold text-brand-500 dark:bg-brand-900/50 dark:text-brand-100",
        workspacePlanBusiness: cn(
          "h-6 border-0 px-3 text-[11px] font-bold",
          brandAccentGradientFill,
          brandAccentOnGradientText,
        ),
        workspacePlanArchived:
          "h-6 border-0 bg-muted px-3 text-[11px] font-bold text-muted-foreground",
        workspaceRoleOwner:
          "h-5 border-0 bg-brand-100 px-3 text-[10px] font-bold tracking-wide text-brand-500 uppercase dark:bg-brand-900/40 dark:text-brand-100",
        workspaceRoleAdmin:
          "h-5 border-0 bg-green-100 px-3 text-[10px] font-bold tracking-wide text-green-500 uppercase dark:bg-green-900/30 dark:text-green-400",
        workspaceRoleMember:
          "h-5 border-0 bg-secondary-gray-300 px-3 text-[10px] font-bold tracking-wide text-secondary-gray-700 uppercase dark:bg-navy-700 dark:text-secondary-gray-600",
        /** Workspace settings — feedback category pills (surface + subtle border). */
        categoryCapsule:
          "h-8 min-h-8 rounded-full border-border bg-muted/50 px-3 py-0 text-sm font-medium text-foreground shadow-none has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [a]:hover:bg-muted dark:bg-muted/30 dark:[a]:hover:bg-muted/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
