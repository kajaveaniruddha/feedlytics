import type { Meta, StoryObj } from "@storybook/nextjs";

import { TextLink } from "./text-link";

const meta: Meta<typeof TextLink> = {
  title: "UI/Atoms/TextLink",
  component: TextLink,
  args: {
    href: "/signup",
    children: "Create account",
    variant: "inline",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["inline", "inlineSm"],
    },
  },
};
export default meta;

type Story = StoryObj<typeof TextLink>;

export const Inline: Story = {};

export const InlineSm: Story = {
  args: { variant: "inlineSm", children: "Forgot password?" },
};
