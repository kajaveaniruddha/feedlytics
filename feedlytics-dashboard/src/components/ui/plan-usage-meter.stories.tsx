import type { Meta, StoryObj } from "@storybook/nextjs";

import { PlanUsageMeter } from "./plan-usage-meter";

const meta: Meta<typeof PlanUsageMeter> = {
  title: "UI/PlanUsageMeter",
  component: PlanUsageMeter,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="w-[340px] bg-bg p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof PlanUsageMeter>;

export const Brand: Story = {
  args: {
    label: "Feedbacks",
    used: 847,
    limit: 2000,
    tone: "brand",
  },
};

export const Green: Story = {
  args: {
    label: "API",
    used: 1240,
    limit: 5000,
    tone: "green",
  },
};

export const Orange: Story = {
  args: {
    label: "Team Members",
    used: 5,
    limit: 10,
    tone: "orange",
  },
};
