import type { Meta, StoryObj } from "@storybook/nextjs";

import { LabeledHorizontalBar } from "./labeled-horizontal-bar";

const meta: Meta<typeof LabeledHorizontalBar> = {
  title: "UI/LabeledHorizontalBar",
  component: LabeledHorizontalBar,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="w-[360px] space-y-4 bg-bg p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof LabeledHorizontalBar>;

export const Default: Story = {
  args: {
    label: "Billing Issues",
    value: 2,
    max: 4,
    tone: "brand",
  },
};

export const Dominant: Story = {
  args: {
    label: "Custom Category Name",
    value: 12,
    max: 12,
    tone: "green",
  },
};

export const Other: Story = {
  args: {
    label: "Other",
    value: 2,
    max: 12,
    tone: "neutral",
  },
};
