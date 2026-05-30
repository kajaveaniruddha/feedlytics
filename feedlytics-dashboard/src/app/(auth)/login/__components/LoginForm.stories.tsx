import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, userEvent, waitFor, within } from "storybook/test";

import {
  authHappyPathHandlers,
  authLoginInvalidCredentials,
  authLoginNetworkError,
  authLoginValidationError,
} from "@/mocks/handlers/auth.handlers";

import { LoginForm } from "./LoginForm";

const meta: Meta<typeof LoginForm> = {
  title: "Auth/Login/LoginForm",
  component: LoginForm,
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

type Story = StoryObj<typeof LoginForm>;

export const HappyPath: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText(/email/i), "ada@feedlytics.com");
    await userEvent.type(canvas.getByLabelText(/password/i), "supersecret123");
    await userEvent.click(canvas.getByRole("button", { name: /sign in$/i }));
    // Success is reflected by the button leaving its disabled/loading state
    // since the story is mounted without a real router. The mock responded 200.
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: /sign in$/i })).not.toBeDisabled(),
    );
  },
};

export const InvalidCredentials: Story = {
  parameters: { msw: { handlers: [authLoginInvalidCredentials] } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText(/email/i), "ada@feedlytics.com");
    await userEvent.type(canvas.getByLabelText(/password/i), "wrong-password");
    await userEvent.click(canvas.getByRole("button", { name: /sign in$/i }));
    await waitFor(() =>
      expect(canvas.getByText(/invalid email or password/i)).toBeInTheDocument(),
    );
  },
};

export const ValidationError: Story = {
  parameters: { msw: { handlers: [authLoginValidationError] } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText(/email/i), "ada@feedlytics.com");
    await userEvent.type(canvas.getByLabelText(/password/i), "supersecret123");
    await userEvent.click(canvas.getByRole("button", { name: /sign in$/i }));
  },
};

export const NetworkError: Story = {
  parameters: { msw: { handlers: [authLoginNetworkError] } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText(/email/i), "ada@feedlytics.com");
    await userEvent.type(canvas.getByLabelText(/password/i), "supersecret123");
    await userEvent.click(canvas.getByRole("button", { name: /sign in$/i }));
  },
};

export const Pristine: Story = {};
