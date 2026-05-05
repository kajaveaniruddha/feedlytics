/**
 * Side-effect only: wires concrete OAuth strategies into the factory.
 * Imported once from `app/providers.tsx` — kept out of `@/lib/oauth` barrel
 * so that module stays side-effect-free for React Fast Refresh.
 */
import { GoogleOAuthStrategy } from "@/lib/oauth/GoogleOAuthStrategy";
import { OAuthFactory } from "@/lib/oauth/OAuthFactory";

OAuthFactory.register(new GoogleOAuthStrategy());
