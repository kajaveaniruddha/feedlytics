import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, userEvent, waitFor, within } from "storybook/test";

import {
  authHappyPathHandlers,
  authRegisterAutoVerified,
  authRegisterEmailExists,
} from "@/mocks/handlers/auth.handlers";

import { SignupForm } from "./SignupForm";

const meta: Meta<typeof SignupForm> = {
  title: "Auth/Signup/SignupForm",
  component: SignupForm,
  parameters: {
    layout: "fullscreen",
    msw: { handlers: authHappyPathHandlers },
  },
  decorators: [
    (Story) => (
      <div className="mx-auto flex min-h-screen w-full max-w-[480px] items-center justify-center p-6">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof SignupForm>;

export const Pristine: Story = {};

export const HappyPath: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText(/^name/i), "Ada Lovelace");
    await userEvent.type(canvas.getByLabelText(/email/i), "ada@feedlytics.com");
    await userEvent.type(canvas.getByLabelText(/password/i), "supersecret123");
    await userEvent.click(canvas.getByRole("button", { name: /create account/i }));
  },
};

export const AutoVerified: Story = {
  parameters: { msw: { handlers: [authRegisterAutoVerified] } },
};

export const EmailExists: Story = {
  parameters: { msw: { handlers: [authRegisterEmailExists] } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText(/^name/i), "Ada Lovelace");
    await userEvent.type(canvas.getByLabelText(/email/i), "ada@feedlytics.com");
    await userEvent.type(canvas.getByLabelText(/password/i), "supersecret123");
    await userEvent.click(canvas.getByRole("button", { name: /create account/i }));
    await waitFor(() =>
      expect(canvas.getByText(/email already registered/i)).toBeInTheDocument(),
    );
  },
};
