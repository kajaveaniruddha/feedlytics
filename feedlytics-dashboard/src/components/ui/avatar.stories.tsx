import type { Meta, StoryObj } from "@storybook/nextjs";

import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

const meta: Meta<typeof Avatar> = {
  title: "UI/Atoms/Avatar",
  component: Avatar,
};
export default meta;

type Story = StoryObj<typeof Avatar>;

export const WithImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=AL" alt="Ada" />
      <AvatarFallback>AL</AvatarFallback>
    </Avatar>
  ),
};

export const FallbackOnly: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>AL</AvatarFallback>
    </Avatar>
  ),
};
