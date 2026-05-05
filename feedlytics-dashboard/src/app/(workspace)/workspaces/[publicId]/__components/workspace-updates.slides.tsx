import type { WorkspaceUpdateSlide } from "@/components/layout/WorkspaceUpdatesCarousel";
import { routes } from "@/config/routes";

import {
  AnalyticsStatPlaceholder,
  CampaignRowsPlaceholder,
  ProComparePlaceholder,
  WidgetPreviewPlaceholder,
} from "./adsBanners";

export type { WorkspaceUpdateSlide };

const base = (publicId: string) => routes.workspace(publicId);

/**
 * Four distinct workspace promo slides aligned with Plans/Future/UX/workspace-dashboard.html.
 */
export function workspaceUpdateSlides(workspacePublicId: string): WorkspaceUpdateSlide[] {
  const w = base(workspacePublicId);
  return [
    {
      id: "workspace-update-analytics",
      shellClassName: "bg-gradient-to-br from-[#F59E0B] to-[#EF4444]",
      ctaClassName: "text-red-500",
      title: "Advanced Analytics\n& Insights",
      description:
        "Track trends, sentiment shifts, and category distributions with real-time analytics and custom reports.",
      ctaLabel: "View Analytics",
      href: `${w}#analytics`,
      visual: <AnalyticsStatPlaceholder />,
    },
    {
      id: "workspace-update-pro",
      shellClassName: "bg-gradient-to-br from-brand-500 to-brand-900",
      ctaClassName: "text-brand-900",
      title: "Unlock More with\nthe Pro Plan",
      description:
        "20,000 feedbacks/month, 365-day retention, AI analysis, and priority support. Up from 200/month and 90-day retention on Free.",
      ctaLabel: "Upgrade to Pro",
      href: `${w}#upgrade`,
      visual: <ProComparePlaceholder />,
    },
    {
      id: "workspace-update-campaigns",
      shellClassName: "bg-gradient-to-br from-[#01B574] to-[#0D9488]",
      ctaClassName: "text-[#0D9488]",
      title: "Campaigns\nComing Soon",
      description:
        "Target the right users at the right time. Run feedback campaigns by segment, event, or schedule.",
      ctaLabel: "Join Waitlist",
      href: `${w}#campaigns-waitlist`,
      visual: <CampaignRowsPlaceholder />,
    },
    {
      id: "workspace-update-widget",
      shellClassName: "bg-gradient-to-br from-[#868CFF] to-brand-500",
      title: "Customize Your\nFeedback Widget",
      description:
        "Set up your theme, pick a layout, and embed it on your site in under a minute.",
      ctaLabel: "Open Widget Editor",
      href: `${w}#widget-editor`,
      visual: <WidgetPreviewPlaceholder />,
    },
  ];
}
