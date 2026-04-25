import { z } from "zod";

const hexColor = z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color");

const optionalUrl = z
  .union([z.string(), z.null()])
  .transform((v) => (v === "" || v === null ? null : v))
  .pipe(z.string().url().nullable());

export const formThemeSchema = z.object({
  formBgColor: hexColor,
  formTextColor: hexColor,
  accentColor: hexColor,
  inputBgColor: hexColor,
  inputBorderColor: hexColor,
  inputTextColor: hexColor,
  secondaryTextColor: hexColor,
  fontFamily: z.enum(["Inter", "DM Sans", "Plus Jakarta Sans", "Poppins", "Space Grotesk", "Merriweather", "System"]),
  borderRadius: z.number().min(0).max(32),
  shadow: z.enum(["none", "subtle", "medium", "strong"]),
  cardMaxWidth: z.number().min(380).max(560),
  cardPadding: z.enum(["compact", "default", "spacious"]),
  successMessage: z.string().max(200),
  showConfetti: z.boolean(),
  successRedirectUrl: optionalUrl,
  successCtaText: z.string().max(30).nullable(),
  successCtaUrl: optionalUrl,
  buttonText: z.string().min(1).max(30),
}).partial();
