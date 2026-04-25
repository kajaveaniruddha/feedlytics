export const FONT_OPTIONS = ["Inter", "DM Sans", "Plus Jakarta Sans", "Poppins", "Space Grotesk", "Merriweather", "System"] as const;

export type FontFamily = typeof FONT_OPTIONS[number];
export type ShadowType = "none" | "subtle" | "medium" | "strong";
export type PaddingType = "compact" | "default" | "spacious";

export interface FormTheme {
  formBgColor: string;
  formTextColor: string;
  accentColor: string;
  inputBgColor: string;
  inputBorderColor: string;
  inputTextColor: string;
  secondaryTextColor: string;
  fontFamily: FontFamily;
  borderRadius: number;
  shadow: ShadowType;
  cardMaxWidth: number;
  cardPadding: PaddingType;
  successMessage: string;
  showConfetti: boolean;
  successRedirectUrl: string | null;
  successCtaText: string | null;
  successCtaUrl: string | null;
  buttonText: string;
}

export const DEFAULT_FORM_THEME: FormTheme = {
  formBgColor: "#FFFFFF",
  formTextColor: "#1A1A1A",
  accentColor: "#6366F1",
  inputBgColor: "#F9FAFB",
  inputBorderColor: "#E5E7EB",
  inputTextColor: "#111827",
  secondaryTextColor: "#6B7280",
  fontFamily: "Inter",
  borderRadius: 12,
  shadow: "subtle",
  cardMaxWidth: 432,
  cardPadding: "default",
  successMessage: "Thank you for your feedback!",
  showConfetti: true,
  successRedirectUrl: null,
  successCtaText: null,
  successCtaUrl: null,
  buttonText: "Send Feedback",
};

export const SHADOW_MAP: Record<string, string> = {
  none: "none",
  subtle: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)",
  medium: "0 4px 12px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)",
  strong: "0 10px 30px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.08)",
};

export const PADDING_MAP: Record<string, number> = {
  compact: 16,
  default: 24,
  spacious: 32,
};

export const FONT_MAP: Record<string, string> = {
  Inter: "'Inter', sans-serif",
  "DM Sans": "'DM Sans', sans-serif",
  "Plus Jakarta Sans": "'Plus Jakarta Sans', sans-serif",
  Poppins: "'Poppins', sans-serif",
  "Space Grotesk": "'Space Grotesk', sans-serif",
  Merriweather: "'Merriweather', serif",
  System: "system-ui, -apple-system, sans-serif",
};

export const GOOGLE_FONT_URLS: Record<string, string> = {
  Inter: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
  "DM Sans": "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap",
  "Plus Jakarta Sans": "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap",
  Poppins: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap",
  "Space Grotesk": "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap",
  Merriweather: "https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap",
};

export function mergeWithDefaults(partial: Partial<FormTheme> | null | undefined): FormTheme {
  return { ...DEFAULT_FORM_THEME, ...partial };
}
