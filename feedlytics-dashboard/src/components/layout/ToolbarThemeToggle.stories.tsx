import type { Meta, StoryObj } from "@storybook/nextjs";

import { ToolbarThemeToggle } from "./ToolbarThemeToggle";

const meta: Meta<typeof ToolbarThemeToggle> = {
  title: "Layout/ToolbarThemeToggle",
  component: ToolbarThemeToggle,
};
export default meta;

type Story = StoryObj<typeof ToolbarThemeToggle>;

export const Default: Story = {};
