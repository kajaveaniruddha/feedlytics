/**
 * Google Identity Services strategy.
 *
 * Loads the GIS SDK once, shows a single modal with the official Google button
 * (`renderButton`), receives an `id_token`, and forwards it to the Kotlin backend's
 * `/api/v1/auth/oauth/google` endpoint.
 *
 * We do not call `gis.prompt()` (One Tap) on this path: One Tap (top-right) plus the
 * fallback modal produced two overlapping Google UIs when users clicked login.
 *
 * The SDK is only loaded in the browser; SSR never touches this file.
 */
import { env } from "@/config/env";
import { ApiError } from "@/services/api/errors/ApiError";
import { authService } from "@/services/auth/auth.service";

import type { OAuthStrategy } from "@/lib/oauth/OAuthStrategy";
import type { AuthResponse } from "@/features/auth/types/auth.types";

const GIS_SRC = "https://accounts.google.com/gsi/client";

type GisIdClient = NonNullable<NonNullable<Window["google"]>["accounts"]>["id"];
type GisCredentialResponse = { credential?: string };

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

function showGoogleButtonOverlay(
  gis: NonNullable<GisIdClient>,
  onDismiss: () => void,
): void {
  const overlay = document.createElement("div");
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Sign in with Google");
  overlay.style.cssText =
    "position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(15,23,42,0.55);padding:16px";

  const panel = document.createElement("div");
  panel.style.cssText =
    "display:flex;flex-direction:column;align-items:center;gap:16px;background:#fff;border-radius:16px;padding:24px;box-shadow:0 20px 40px rgba(15,23,42,0.2)";

  const buttonHost = document.createElement("div");
  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.textContent = "Cancel";
  cancelButton.style.cssText =
    "border:none;background:transparent;color:#64748b;font-size:14px;cursor:pointer;padding:4px 8px";

  panel.appendChild(buttonHost);
  panel.appendChild(cancelButton);
  overlay.appendChild(panel);
  document.body.appendChild(overlay);

  const dismiss = () => {
    overlay.remove();
    onDismiss();
  };
  cancelButton.addEventListener("click", dismiss);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) dismiss();
  });

  gis.renderButton(buttonHost, {
    type: "standard",
    theme: "outline",
    size: "large",
    text: "continue_with",
    width: 300,
  });
}

function requestGoogleIdToken(
  gis: NonNullable<GisIdClient>,
  clientId: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    let settled = false;
    const settle = (action: () => void) => {
      if (settled) return;
      settled = true;
      action();
    };

    gis.initialize({
      client_id: clientId,
      callback: (response: GisCredentialResponse) => {
        document.querySelector('[role="dialog"][aria-label="Sign in with Google"]')?.remove();
        if (response?.credential) {
          settle(() => resolve(response.credential!));
        } else {
          settle(() =>
            reject(
              new ApiError(
                "OAUTH_TOKEN_INVALID",
                "Google did not return an id_token",
                0,
              ),
            ),
          );
        }
      },
      auto_select: false,
      use_fedcm_for_prompt: false,
    });

    // Button-initiated sign-in: one surface only (modal + official Google button).
    // Do not call `gis.prompt()` here — it shows One Tap (top-right) and often stacks
    // with this overlay, which feels like double authentication.
    showGoogleButtonOverlay(gis, () => {
      settle(() =>
        reject(
          new ApiError(
            "OAUTH_DISMISSED",
            "Google sign-in dismissed — try again.",
            0,
          ),
        ),
      );
    });
  });
}

export class GoogleOAuthStrategy implements OAuthStrategy {
  readonly provider = "google" as const;

  async authenticate(inviteToken?: string): Promise<AuthResponse> {
    const clientId = env.googleClientId?.trim() || "";
    if (!clientId) {
      throw new ApiError(
        "OAUTH_NOT_CONFIGURED",
        "Google sign-in isn't configured in this environment.",
        0,
      );
    }

    await loadGis();

    const gis = window.google?.accounts?.id;
    if (!gis) {
      throw new ApiError("OAUTH_SDK_UNAVAILABLE", "Google SDK unavailable", 0);
    }

    const idToken = await requestGoogleIdToken(gis, clientId);
    return authService.oauthSignIn("google", idToken, inviteToken);
  }
}
