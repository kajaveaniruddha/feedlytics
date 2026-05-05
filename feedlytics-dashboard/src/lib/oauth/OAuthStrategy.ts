/**
 * OAuth Strategy contract — mirrors the backend's `OAuthProvider.kt` contract.
 *
 * One file per provider implements this interface. The factory
 * resolves a key → instance at runtime so adding GitHub or Apple is a single
 * file drop, no switch/case edits (open/closed).
 */
import type { AuthResponse, OAuthProviderKey } from "@/features/auth/types/auth.types";

export interface OAuthStrategy {
  readonly provider: OAuthProviderKey;

  /**
   * Trigger the provider's sign-in flow (popup / redirect / prompt) and return
   * the exchanged `AuthResponse` from the Kotlin backend. The strategy is
   * responsible for acquiring the id_token and calling `authService.oauthSignIn`.
   */
  authenticate(inviteToken?: string): Promise<AuthResponse>;
}
