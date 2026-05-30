import type { Meta, StoryObj } from "@storybook/nextjs";

import { SparklineAreaChart } from "./sparkline-area-chart";

const meta: Meta<typeof SparklineAreaChart> = {
  title: "UI/SparklineAreaChart",
  component: SparklineAreaChart,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="h-[100px] w-[360px] bg-bg p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof SparklineAreaChart>;

export const Peaked: Story = {
  args: {
    values: [2, 3, 2, 4, 3, 5, 4, 6, 5, 4, 7, 6, 5, 8, 7, 6, 9, 8, 7, 10, 9, 8, 11, 10, 9, 12, 11, 10, 8, 6],
  },
};

export const Flat: Story = {
  args: {
    values: Array.from({ length: 30 }, () => 3),
  },
};

export const Empty: Story = {
  args: {
    values: [],
  },
};
