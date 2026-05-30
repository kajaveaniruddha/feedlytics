/**
 * Public OAuth surface (factory + types). Strategy registration lives in
 * `strategies-register.ts`, imported only from the root client Providers.
 */
export { OAuthFactory } from "@/lib/oauth/OAuthFactory";
export type { OAuthStrategy } from "@/lib/oauth/OAuthStrategy";
