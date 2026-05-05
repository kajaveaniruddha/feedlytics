/**
 * Google Identity Services strategy.
 *
 * Loads the GIS SDK once, prompts the user, receives an `id_token`, and
 * forwards it to the Kotlin backend's `/api/v1/auth/oauth/google` endpoint.
 *
 * The SDK is only loaded in the browser; SSR never touches this file.
 */
import { oauthConfig } from "@/config/oauth";
import { ApiError } from "@/services/api/errors/ApiError";
import { authService } from "@/services/auth/auth.service";

import type { OAuthStrategy } from "@/lib/oauth/OAuthStrategy";
import type { AuthResponse } from "@/features/auth/types/auth.types";

const GIS_SRC = "https://accounts.google.com/gsi/client";

let gisPromise: Promise<void> | null = null;

function loadGis(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new ApiError("SSR_UNSUPPORTED", "OAuth requires the browser", 0));
  }
  if (window.google?.accounts?.id) return Promise.resolve();
  if (gisPromise) return gisPromise;
  gisPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = GIS_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new ApiError("OAUTH_SDK_LOAD_FAILED", "Could not load Google sign-in", 0));
    document.head.appendChild(script);
  });
  return gisPromise;
}

export class GoogleOAuthStrategy implements OAuthStrategy {
  readonly provider = "google" as const;

  async authenticate(inviteToken?: string): Promise<AuthResponse> {
    if (!oauthConfig.google.clientId) {
      throw new ApiError(
        "OAUTH_NOT_CONFIGURED",
        "Google sign-in isn't configured in this environment.",
        0,
      );
    }

    await loadGis();

    const idToken = await new Promise<string>((resolve, reject) => {
      const gis = window.google?.accounts?.id;
      if (!gis) {
        reject(new ApiError("OAUTH_SDK_UNAVAILABLE", "Google SDK unavailable", 0));
        return;
      }
      gis.initialize({
        client_id: oauthConfig.google.clientId,
        callback: (response: { credential?: string }) => {
          if (response?.credential) {
            resolve(response.credential);
          } else {
            reject(
              new ApiError(
                "OAUTH_TOKEN_INVALID",
                "Google did not return an id_token",
                0,
              ),
            );
          }
        },
        auto_select: false,
        use_fedcm_for_prompt: true,
      });
      gis.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          reject(
            new ApiError(
              "OAUTH_DISMISSED",
              "Google sign-in dismissed — try again.",
              0,
            ),
          );
        }
      });
    });

    return authService.oauthSignIn("google", idToken, inviteToken);
  }
}
