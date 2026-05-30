import type { Meta, StoryObj } from "@storybook/nextjs";
import { http, HttpResponse } from "msw";

import { env } from "@/config/env";
import { endpoints } from "@/services/api/endpoints";
import { authHappyPathHandlers } from "@/mocks/handlers/auth.handlers";

import { EmailVerificationStep } from "./EmailVerificationStep";

const meta: Meta<typeof EmailVerificationStep> = {
  title: "Auth/Signup/EmailVerificationStep",
  component: EmailVerificationStep,
  parameters: {
    layout: "fullscreen",
    msw: { handlers: authHappyPathHandlers },
    nextjs: {
      appDirectory: true,
      navigation: {
        query: { email: "ada@feedlytics.com" },
      },
    },
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

type Story = StoryObj<typeof EmailVerificationStep>;

export const Pristine: Story = {};

export const InvalidCode: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post(`${env.apiBaseUrl}${endpoints.auth.verifyEmail}`, () =>
          HttpResponse.json(
            {
              success: false,
              error: { code: "INVALID_CODE", message: "Invalid code" },
            },
            { status: 400 },
          ),
        ),
      ],
    },
  },
};
