import type { Meta, StoryObj } from "@storybook/nextjs";

import { Heading } from "./heading";

const meta: Meta<typeof Heading> = {
  title: "UI/Atoms/Heading",
  component: Heading,
  args: {
    children: "Welcome back",
    variant: "primary",
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "tertiary",
        "display",
        "cardTitle",
        "workspacePageTitle",
        "kpi",
      ],
    },
  },
};
export default meta;

type Story = StoryObj<typeof Heading>;

export const Primary: Story = {
  args: { variant: "primary" },
};

export const PrimaryWithSubheading: Story = {
  args: {
    variant: "primary",
    subheading: "Enter your email and password to sign in.",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Welcome to Feedlytics",
  },
  decorators: [
    (Story) => (
      <div className="rounded-lg bg-navy-900 p-8 text-center">
        <Story />
      </div>
    ),
  ],
};

export const Tertiary: Story = {
  args: {
    variant: "tertiary",
    children: "Section title",
  },
};

export const Display: Story = {
  args: {
    variant: "display",
    as: "h1",
    children: "Choose Your Workspace",
  },
};

export const CardTitle: Story = {
  args: {
    variant: "cardTitle",
    as: "h2",
    children: "My SaaS Project",
  },
};

export const Kpi: Story = {
  args: {
    variant: "kpi",
    as: "p",
    children: "1,247",
  },
};

export const WorkspacePageTitle: Story = {
  args: {
    variant: "workspacePageTitle",
    as: "h1",
    children: "Dashboard",
  },
};
