import type { Meta, StoryObj } from "@storybook/nextjs";

import { workspaceKpiIconSlots } from "@/features/workspace/constants/workspace-kpi-icons";

import { KpiStatCard } from "./KpiStatCard";

const meta: Meta<typeof KpiStatCard> = {
  title: "Layout/KpiStatCard",
  component: KpiStatCard,
  args: {
    label: "Total feedbacks",
    value: "1,247",
    icon: workspaceKpiIconSlots.totalFeedbacks,
  },
};
export default meta;

type Story = StoryObj<typeof KpiStatCard>;

export const Default: Story = {};

export const WithHint: Story = {
  args: { hint: "Last 30 days" },
};

export const HighlightSentiment: Story = {
  args: {
    label: "Positive Sentiment",
    value: "68%",
    variant: "highlight",
    icon: workspaceKpiIconSlots.positiveSentiment,
  },
};

export const WithMessageIcon: Story = {
  args: {
    label: "Total Feedbacks",
    value: "1,247",
    icon: workspaceKpiIconSlots.totalFeedbacks,
  },
};

export const WithStarIcon: Story = {
  args: {
    label: "Average Rating",
    value: "4.6",
    icon: workspaceKpiIconSlots.averageRating,
  },
};

export const WithTagIcon: Story = {
  args: {
    label: "Top Category",
    value: "Feature Request",
    icon: workspaceKpiIconSlots.topCategory,
  },
};
