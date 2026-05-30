import type { WorkspaceWidgetDto } from "@/services/workspace/workspaceWidget.service";

export const defaultWorkspaceWidgetTheme = {
  formBgColor: "#FFFFFF",
  formTextColor: "#1A1A1A",
  accentColor: "#6366F1",
  inputBgColor: "#F9FAFB",
  inputBorderColor: "#E5E7EB",
  inputTextColor: "#111827",
  secondaryTextColor: "#6B7280",
  fontFamily: "Inter",
  borderRadius: 12,
  shadow: "subtle" as const,
  cardMaxWidth: 432,
  cardPadding: "default" as const,
  successMessage: "Thank you for your feedback!",
  showConfetti: true,
  successRedirectUrl: null as string | null,
  successCtaText: null as string | null,
  successCtaUrl: null as string | null,
  buttonText: "Send Feedback",
};

export const workspaceWidgetFixture: WorkspaceWidgetDto = {
  collectName: false,
  collectEmail: true,
  theme: { ...defaultWorkspaceWidgetTheme },
  isActive: true,
  createdAt: "2025-01-01T00:00:00.000Z",
  updatedAt: "2025-01-01T00:00:00.000Z",
};
