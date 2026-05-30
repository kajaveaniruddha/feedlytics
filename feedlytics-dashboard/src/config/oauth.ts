import { env } from "@/config/env";

export const oauthConfig = {
  google: {
    clientId: env.googleClientId ?? "",
    scopes: ["openid", "email", "profile"],
  },
} as const;

export type OAuthProviderKey = keyof typeof oauthConfig;
