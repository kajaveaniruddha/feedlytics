/**
 * Registry + resolver for `OAuthStrategy` implementations.
 *
 * Mirrors backend `OAuthProviderFactory.kt`. Adding a provider is:
 *   1. Implement `OAuthStrategy` in a new file.
 *   2. `OAuthFactory.register(new MyProviderStrategy())` at module init.
 * No switch-case to edit anywhere in the app.
 */
import { ApiError } from "@/services/api/errors/ApiError";

import type { OAuthStrategy } from "@/lib/oauth/OAuthStrategy";
import type { OAuthProviderKey } from "@/features/auth/types/auth.types";

class OAuthFactoryImpl {
  private registry = new Map<OAuthProviderKey, OAuthStrategy>();

  register(strategy: OAuthStrategy): void {
    this.registry.set(strategy.provider, strategy);
  }

  get(provider: OAuthProviderKey): OAuthStrategy {
    const strategy = this.registry.get(provider);
    if (!strategy) {
      throw new ApiError(
        "OAUTH_PROVIDER_UNSUPPORTED",
        `OAuth provider '${provider}' is not registered`,
        400,
      );
    }
    return strategy;
  }

  list(): OAuthProviderKey[] {
    return [...this.registry.keys()];
  }
}

export const OAuthFactory = new OAuthFactoryImpl();
