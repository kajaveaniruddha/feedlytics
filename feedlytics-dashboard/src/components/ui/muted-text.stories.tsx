import type { Meta, StoryObj } from "@storybook/nextjs";

import { MutedText } from "./muted-text";
import { TextLink } from "./text-link";

const meta: Meta<typeof MutedText> = {
  title: "UI/Atoms/MutedText",
  component: MutedText,
  argTypes: {
    tone: { control: "select", options: ["default", "subtle", "destructive"] },
    align: { control: "select", options: ["start", "center"] },
  },
};
export default meta;

type Story = StoryObj<typeof MutedText>;

export const Default: Story = {
  args: {
    children: "No account? Create one.",
  },
};

export const WithInlineLink: Story = {
  render: () => (
    <MutedText>
      No account? <TextLink href="/signup">Create account</TextLink>
    </MutedText>
  ),
};

export const Subtle: Story = {
  args: {
    tone: "subtle",
    children: "Welcome back, Ada",
  },
};

export const Destructive: Story = {
  args: {
    tone: "destructive",
    children: "Something went wrong.",
  },
};

export const Centered: Story = {
  args: {
    align: "center",
    children: "No workspaces match your search.",
  },
};
