import type { Meta, StoryObj } from "@storybook/nextjs";

import { SegmentedDistributionBar } from "./segmented-distribution-bar";

const meta: Meta<typeof SegmentedDistributionBar> = {
  title: "UI/SegmentedDistributionBar",
  component: SegmentedDistributionBar,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="w-[360px] bg-bg p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof SegmentedDistributionBar>;

const sentimentSegments = [
  { id: "positive", label: "Positive", value: 3, colorClass: "bg-[#01B574]" },
  { id: "negative", label: "Negative", value: 2, colorClass: "bg-[#E31A1A]" },
  { id: "neutral", label: "Neutral", value: 1, colorClass: "bg-secondary-gray-500" },
];

export const MultiSegment: Story = {
  args: {
    segments: sentimentSegments,
  },
};

export const SingleSegment: Story = {
  args: {
    segments: [
      { id: "positive", label: "Positive", value: 10, colorClass: "bg-[#01B574]" },
      { id: "negative", label: "Negative", value: 0, colorClass: "bg-[#E31A1A]" },
      { id: "neutral", label: "Neutral", value: 0, colorClass: "bg-secondary-gray-500" },
    ],
  },
};

export const Empty: Story = {
  args: {
    segments: [
      { id: "positive", label: "Positive", value: 0, colorClass: "bg-[#01B574]" },
      { id: "negative", label: "Negative", value: 0, colorClass: "bg-[#E31A1A]" },
      { id: "neutral", label: "Neutral", value: 0, colorClass: "bg-secondary-gray-500" },
    ],
  },
};
