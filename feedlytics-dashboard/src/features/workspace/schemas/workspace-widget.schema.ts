import { z } from "zod";

const FONT_FAMILY_ENUM = [
  "Inter",
  "DM Sans",
  "Plus Jakarta Sans",
  "Poppins",
  "Space Grotesk",
  "Merriweather",
  "System",
] as const;

const hexColor = z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Use a valid hex color (#RRGGBB)");

const httpUrlOrEmpty = z
  .string()
  .max(512)
  .refine((s) => !s.trim() || /^https?:\/\/.+/i.test(s.trim()), "URL must start with http:// or https://");

export const widgetThemeFormSchema = z.object({
  formBgColor: hexColor,
  formTextColor: hexColor,
  accentColor: hexColor,
  inputBgColor: hexColor,
  inputBorderColor: hexColor,
  inputTextColor: hexColor,
  secondaryTextColor: hexColor,
  fontFamily: z.enum(FONT_FAMILY_ENUM),
  borderRadius: z.number().int().min(0).max(48),
  shadow: z.enum(["none", "subtle", "medium", "strong"]),
  cardMaxWidth: z.number().int().min(280).max(720),
  cardPadding: z.enum(["compact", "default", "spacious"]),
  successMessage: z.string().min(1).max(500),
  showConfetti: z.boolean(),
  successRedirectUrl: httpUrlOrEmpty,
  successCtaText: z.string().max(120),
  successCtaUrl: httpUrlOrEmpty,
  buttonText: z.string().min(1).max(120),
});

export const workspaceWidgetFormSchema = z.object({
  collectName: z.boolean(),
  collectEmail: z.boolean(),
  isActive: z.boolean(),
  theme: widgetThemeFormSchema,
});

export type WorkspaceWidgetFormValues = z.infer<typeof workspaceWidgetFormSchema>;
