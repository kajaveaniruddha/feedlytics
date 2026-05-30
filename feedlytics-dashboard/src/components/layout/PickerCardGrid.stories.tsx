import type { Meta, StoryObj } from "@storybook/nextjs";

import { PickerCardGrid } from "./PickerCardGrid";

const meta: Meta<typeof PickerCardGrid> = {
  title: "Layout/PickerCardGrid",
  component: PickerCardGrid,
};
export default meta;

type Story = StoryObj<typeof PickerCardGrid>;

export const Default: Story = {
  render: () => (
    <PickerCardGrid>
      <div className="h-24 rounded-[20px] bg-surface shadow-card dark:bg-navy-800" />
      <div className="h-24 rounded-[20px] bg-surface shadow-card dark:bg-navy-800" />
      <div className="h-24 rounded-[20px] bg-surface shadow-card dark:bg-navy-800" />
    </PickerCardGrid>
  ),
};
