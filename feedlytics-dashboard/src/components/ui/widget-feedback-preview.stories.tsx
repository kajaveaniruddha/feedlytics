import type { Meta, StoryObj } from "@storybook/nextjs";

import { workspaceWidgetFixture } from "@/mocks/fixtures/workspace-widget.fixture";

import { WidgetFeedbackPreview } from "./widget-feedback-preview";

const meta: Meta<typeof WidgetFeedbackPreview> = {
  title: "UI/WidgetFeedbackPreview",
  component: WidgetFeedbackPreview,
};

export default meta;

type Story = StoryObj<typeof WidgetFeedbackPreview>;

export const FormDesktop: Story = {
  args: {
    formTheme: workspaceWidgetFixture.theme,
    collectName: workspaceWidgetFixture.collectName,
    collectEmail: workspaceWidgetFixture.collectEmail,
    previewView: "form",
    variant: "desktop",
  },
};

export const SuccessMobile: Story = {
  args: {
    formTheme: { ...workspaceWidgetFixture.theme, successMessage: "Thanks!" },
    collectName: true,
    collectEmail: true,
    previewView: "success",
    variant: "mobile",
  },
};
