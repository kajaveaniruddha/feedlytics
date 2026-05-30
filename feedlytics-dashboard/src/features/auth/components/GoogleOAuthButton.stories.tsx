import type { Meta, StoryObj } from "@storybook/nextjs";

import { GoogleOAuthButton } from "./GoogleOAuthButton";

const meta: Meta<typeof GoogleOAuthButton> = {
  title: "Auth/GoogleOAuthButton",
  component: GoogleOAuthButton,
  decorators: [
    (Story) => (
      <div className="w-[420px]">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof GoogleOAuthButton>;

export const SignIn: Story = { args: { label: "Sign in with Google" } };
export const SignUp: Story = { args: { label: "Sign up with Google" } };
