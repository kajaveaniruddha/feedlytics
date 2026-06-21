/**
 * Maps backend `ApiException` codes to user-facing copy.
 * Centralising this mapping keeps feature components free of `if (code === ...)`
 * ladders and makes it trivial to swap copy without touching logic.
 */
export const errorMessages: Record<string, string> = {
  INVALID_CREDENTIALS: "That email and password combination is not correct.",
  EMAIL_EXISTS: "An account with this email already exists.",
  EMAIL_NOT_VERIFIED:
    "Please verify your email before signing in. A new verification code will be sent to your inbox.",
  USER_NOT_FOUND: "We couldn't find an account for that email.",
  ALREADY_VERIFIED: "This email is already verified — just log in.",
  VALIDATION_ERROR: "Please fix the highlighted fields and try again.",
  OAUTH_PROVIDER_UNSUPPORTED: "That sign-in method isn't available yet.",
  OAUTH_NOT_CONFIGURED: "Google sign-in isn't configured in this environment.",
  OAUTH_DISMISSED: "Google sign-in was cancelled — try again when you're ready.",
  OAUTH_SDK_LOAD_FAILED: "Couldn't load Google sign-in — check your connection and retry.",
  OAUTH_SDK_UNAVAILABLE: "Google sign-in is unavailable — refresh the page and try again.",
  INVALID_GOOGLE_TOKEN: "Google rejected the sign-in — please try again.",
  OAUTH_TOKEN_INVALID: "Google rejected the sign-in — please try again.",
  INTERNAL_ERROR: "Something broke on our side. Please retry in a moment.",
  NOT_AUTHENTICATED: "You're signed out — please log in again.",
  NETWORK_ERROR: "Connection lost. Check your internet and try again.",
};

export function resolveErrorMessage(code: string, fallback?: string): string {
  return errorMessages[code] ?? fallback ?? errorMessages.INTERNAL_ERROR;
}
