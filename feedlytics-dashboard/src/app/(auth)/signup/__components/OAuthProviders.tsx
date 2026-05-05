"use client";

import { Separator } from "@/components/ui/separator";
import { GoogleOAuthButton } from "@/features/auth/components/GoogleOAuthButton";

import { signupCopy } from "../constants/signup.constants";

export function OAuthProviders() {
  return (
    <div className="flex flex-col gap-6">
      <GoogleOAuthButton label="Sign up with Google" />

      <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-subtle dark:text-secondary-gray-600">
        <Separator className="flex-1" />
        <span>{signupCopy.dividerLabel}</span>
        <Separator className="flex-1" />
      </div>
    </div>
  );
}
