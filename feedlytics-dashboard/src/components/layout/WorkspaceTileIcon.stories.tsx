import type { Meta, StoryObj } from "@storybook/nextjs";

import { WorkspaceTileIcon } from "./WorkspaceTileIcon";

const meta: Meta<typeof WorkspaceTileIcon> = {
  title: "Layout/WorkspaceTileIcon",
  component: WorkspaceTileIcon,
  args: { initials: "MS", tone: "brand" },
  argTypes: {
    tone: { control: "select", options: ["brand", "muted", "gradient"] },
  },
};
export default meta;

type Story = StoryObj<typeof WorkspaceTileIcon>;

export const Brand: Story = { args: { initials: "MS", tone: "brand" } };
export const Muted: Story = { args: { initials: "BT", tone: "muted" } };
export const Gradient: Story = { args: { initials: "AC", tone: "gradient" } };

export const SmallBrand: Story = { args: { initials: "FE", tone: "brand", size: "sm" } };
