import type { Meta, StoryObj } from "@storybook/nextjs";

import { Badge } from "./badge";

const meta: Meta<typeof Badge> = {
  title: "UI/Atoms/Badge",
  component: Badge,
  args: { children: "Positive", variant: "default" },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "secondary",
        "destructive",
        "outline",
        "ghost",
        "link",
        "workspacePlanFree",
        "workspacePlanPro",
        "workspacePlanBusiness",
        "workspacePlanArchived",
        "workspaceRoleOwner",
        "workspaceRoleAdmin",
        "workspaceRoleMember",
        "categoryCapsule",
      ],
    },
  },
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {};
export const Secondary: Story = { args: { variant: "secondary", children: "Neutral" } };
export const Destructive: Story = { args: { variant: "destructive", children: "Negative" } };
export const Outline: Story = { args: { variant: "outline", children: "New" } };

export const CategoryCapsule: Story = {
  args: { variant: "categoryCapsule", children: "Billing" },
};
