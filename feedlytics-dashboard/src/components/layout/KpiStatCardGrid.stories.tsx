import type { Meta, StoryObj } from "@storybook/nextjs";

import { workspaceKpiIconSlots } from "@/features/workspace/constants/workspace-kpi-icons";

import { KpiStatCard } from "./KpiStatCard";
import { KpiStatCardGrid } from "./KpiStatCardGrid";

const meta: Meta<typeof KpiStatCardGrid> = {
  title: "Layout/KpiStatCardGrid",
  component: KpiStatCardGrid,
};
export default meta;

type Story = StoryObj<typeof KpiStatCardGrid>;

export const FourUp: Story = {
  render: () => (
    <KpiStatCardGrid>
      <KpiStatCard
        label="Total Feedbacks"
        value="1,247"
        icon={workspaceKpiIconSlots.totalFeedbacks}
      />
      <KpiStatCard
        label="Average Rating"
        value="4.6"
        icon={workspaceKpiIconSlots.averageRating}
      />
      <KpiStatCard label="Top Category" value="Widget" icon={workspaceKpiIconSlots.topCategory} />
      <KpiStatCard
        label="Positive Sentiment"
        value="72%"
        variant="highlight"
        icon={workspaceKpiIconSlots.positiveSentiment}
      />
    </KpiStatCardGrid>
  ),
};
