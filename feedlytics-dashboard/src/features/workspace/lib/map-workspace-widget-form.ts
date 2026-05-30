import { FONT_OPTIONS } from "@/features/workspace/lib/widget-theme-maps";
import type { WorkspaceWidgetFormValues } from "@/features/workspace/schemas/workspace-widget.schema";
import type { WidgetThemeDto, WorkspaceWidgetDto } from "@/services/workspace/workspaceWidget.service";

function normalizeFontFamily(raw: string): WorkspaceWidgetFormValues["theme"]["fontFamily"] {
  const ok = (FONT_OPTIONS as readonly string[]).includes(raw);
  return (ok ? raw : "Inter") as WorkspaceWidgetFormValues["theme"]["fontFamily"];
}

export function mapWorkspaceWidgetDtoToFormValues(d: WorkspaceWidgetDto): WorkspaceWidgetFormValues {
  return {
    collectName: d.collectName,
    collectEmail: d.collectEmail,
    isActive: d.isActive,
    theme: {
      ...d.theme,
      fontFamily: normalizeFontFamily(d.theme.fontFamily),
      successRedirectUrl: d.theme.successRedirectUrl ?? "",
      successCtaText: d.theme.successCtaText ?? "",
      successCtaUrl: d.theme.successCtaUrl ?? "",
    },
  };
}

export function mapFormThemeToWidgetThemeDto(t: WorkspaceWidgetFormValues["theme"]): WidgetThemeDto {
  return {
    ...t,
    successRedirectUrl: t.successRedirectUrl.trim() ? t.successRedirectUrl.trim() : null,
    successCtaText: t.successCtaText.trim() ? t.successCtaText.trim() : null,
    successCtaUrl: t.successCtaUrl.trim() ? t.successCtaUrl.trim() : null,
  };
}
