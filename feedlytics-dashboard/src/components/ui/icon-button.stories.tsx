import type { Meta, StoryObj } from "@storybook/nextjs";
import { BellIcon, SettingsIcon } from "lucide-react";

import { IconButton } from "./icon-button";

const meta: Meta<typeof IconButton> = {
  title: "UI/Atoms/IconButton",
  component: IconButton,
  args: { label: "Notifications" },
};
export default meta;

type Story = StoryObj<typeof IconButton>;

export const Ghost: Story = {
  args: { variant: "ghost" },
  render: (args) => (
    <IconButton {...args}>
      <BellIcon />
    </IconButton>
  ),
};

export const Brand: Story = {
  args: { variant: "brand" },
  render: (args) => (
    <IconButton {...args}>
      <SettingsIcon />
    </IconButton>
  ),
};

export const Loading: Story = {
  args: { variant: "brand", loading: true },
  render: (args) => (
    <IconButton {...args}>
      <BellIcon />
    </IconButton>
  ),
};
