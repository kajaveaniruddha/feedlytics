import { env } from "@/config/env";

export const oauthConfig = {
  google: {
    clientId: env.googleClientId ?? "",
    scopes: ["openid", "email", "profile"],
  },
} as const;

export type OAuthProviderKey = keyof typeof oauthConfig;

/** True when `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set for this build/runtime. */
export function isGoogleOAuthConfigured(): boolean {
  return oauthConfig.google.clientId.length > 0;
}
