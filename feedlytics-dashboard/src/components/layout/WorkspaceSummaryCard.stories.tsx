import type { Meta, StoryObj } from "@storybook/nextjs";

import { WorkspaceSummaryCard } from "./WorkspaceSummaryCard";

const meta: Meta<typeof WorkspaceSummaryCard> = {
  title: "Layout/WorkspaceSummaryCard",
  component: WorkspaceSummaryCard,
  args: {
    name: "My SaaS Project",
    planLabel: "Pro",
    planBadgeVariant: "workspacePlanPro",
    role: "OWNER",
    roleBadgeVariant: "workspaceRoleOwner",
    memberLabel: "5 members",
    feedbackLabel: "847 feedbacks",
    initials: "MS",
    tileTone: "brand",
    avgRating: 4.5,
  },
};
export default meta;

type Story = StoryObj<typeof WorkspaceSummaryCard>;

export const Default: Story = {};

export const NoRating: Story = { args: { avgRating: null } };
