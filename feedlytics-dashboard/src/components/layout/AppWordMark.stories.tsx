import type { Meta, StoryObj } from "@storybook/nextjs";

import { AppWordMark } from "./AppWordMark";

const meta: Meta<typeof AppWordMark> = {
  title: "Layout/AppWordMark",
  component: AppWordMark,
  args: { initials: "FE", children: "FEEDLYTICS" },
};
export default meta;

type Story = StoryObj<typeof AppWordMark>;

export const Default: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <AppWordMark {...args} />
    </div>
  ),
};
