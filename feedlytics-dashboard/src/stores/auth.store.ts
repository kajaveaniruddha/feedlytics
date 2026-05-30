/**
 * `auth.store` — in-memory access token + expiry only.
 *
 * The access token NEVER hits localStorage or a cookie readable by JS. On page
 * refresh the store is empty and the app relies on the backend's HttpOnly
 * refresh cookie + `/api/v1/auth/refresh` to re-establish a session.
 */
import { create } from "zustand";

type AuthState = {
  accessToken: string | null;
  expiresAt: number | null;
  userPublicId: string | null;
};

type AuthActions = {
  setSession: (payload: { accessToken: string; expiresAt: number }) => void;
  setUserMirror: (publicId: string | null) => void;
  clearSession: () => void;
  isAuthenticated: () => boolean;
  isExpired: () => boolean;
};

const initialState: AuthState = {
  accessToken: null,
  expiresAt: null,
  userPublicId: null,
};

export const useAuthStore = create<AuthState & AuthActions>()((set, get) => ({
  ...initialState,

  setSession({ accessToken, expiresAt }) {
    set({ accessToken, expiresAt });
  },

  setUserMirror(publicId) {
    set({ userPublicId: publicId });
  },

  clearSession() {
    set(initialState);
  },

  isAuthenticated() {
    return !!get().accessToken;
  },

  isExpired() {
    const { expiresAt } = get();
    return !!expiresAt && Date.now() >= expiresAt;
  },
}));

/**
 * Pre-curated selector hooks.
 *
 * Always import one of these instead of the raw `useAuthStore` so your
 * component only re-renders when *its* slice changes — the shallow-selector
 * discipline the plan depends on.
 */
export const useAccessToken = () => useAuthStore((s) => s.accessToken);
export const useIsAuthenticated = () => useAuthStore((s) => !!s.accessToken);
