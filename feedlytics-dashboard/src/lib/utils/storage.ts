/**
 * SSR-safe localStorage wrapper. On the server every operation is a no-op;
 * on the client it proxies to `window.localStorage` and swallows quota / JSON
 * errors so callers never have to try/catch.
 *
 * Never store auth tokens here — the access token stays in Zustand memory and
 * the refresh token stays in an HttpOnly cookie per the backend's contract.
 */
const isBrowser = () => typeof window !== "undefined" && !!window.localStorage;

export const storage = {
  get<T>(key: string, fallback: T): T {
    if (!isBrowser()) return fallback;
    try {
      const raw = window.localStorage.getItem(key);
      return raw === null ? fallback : (JSON.parse(raw) as T);
    } catch {
      return fallback;
    }
  },

  set<T>(key: string, value: T): void {
    if (!isBrowser()) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota exceeded or serialization failure — silently drop */
    }
  },

  remove(key: string): void {
    if (!isBrowser()) return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  },
};
