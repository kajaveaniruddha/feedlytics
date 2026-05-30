"use client";

import { GoogleOAuthButton } from "@/features/auth/components/GoogleOAuthButton";
import { Separator } from "@/components/ui/separator";

import { loginCopy } from "../constants/login.constants";

/**
 * Auth-route specific third-party providers strip.
 *
 * Owns no Tailwind — composes atoms (Button via GoogleOAuthButton, Separator)
 * and uses semantic layout via copy.
 */
export function OAuthProviders() {
  return (
    <div className="flex flex-col gap-6">
      <GoogleOAuthButton label={loginCopy.submit === "Sign In" ? "Sign in with Google" : "Continue with Google"} />

      <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-subtle dark:text-secondary-gray-600">
        <Separator className="flex-1" />
        <span>{loginCopy.dividerLabel}</span>
        <Separator className="flex-1" />
      </div>
    </div>
  );
}
