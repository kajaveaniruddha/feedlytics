/**
 * Response interceptor — single-flight refresh on 401.
 *
 * - One `POST /api/v1/auth/refresh` in flight at a time; concurrent 401s await
 *   the same promise so the backend only sees one refresh regardless of how
 *   many requests blew up simultaneously.
 * - After a successful refresh the failed request is retried once.
 * - If the refresh itself fails, the auth store is cleared (user is logged out)
 *   and the original error bubbles so the UI can redirect to /login.
 * - The refresh request is skipped if the user has no active session (no access
 *   token yet), avoiding a noisy 401 during logged-out navigation.
 * - `POST /logout` is never retried via refresh (user intent is to end the session).
 */
import axios, { AxiosError, type AxiosInstance } from "axios";

import { endpoints } from "@/services/api/endpoints";
import type { RetriableRequestConfig } from "@/services/api/client";
import { env } from "@/config/env";
import { useAuthStore } from "@/stores/auth.store";

type RefreshResponseBody = {
  success: boolean;
  accessToken: string;
  expiresIn: number;
  user: {
    publicId: string;
    email: string;
    name: string;
    avatarUrl: string | null;
    isEmailVerified: boolean;
  };
};

let refreshInFlight: Promise<string | null> | null = null;

function refreshAccessToken(): Promise<string | null> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = axios
    .post<RefreshResponseBody>(`${env.apiBaseUrl}${endpoints.auth.refresh}`, null, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    })
    .then((res) => {
      const { accessToken, expiresIn, user } = res.data;
      useAuthStore.getState().setSession({
        accessToken,
        expiresAt: Date.now() + expiresIn * 1000,
      });
      // Mirror user to cache for synchronous shell reads. Keeps the
      // useCurrentUser hook honest even when the backend returns a user here.
      if (user) {
        useAuthStore.getState().setUserMirror(user.publicId);
      }
      return accessToken;
    })
    .catch(() => {
      useAuthStore.getState().clearSession();
      return null;
    })
    .finally(() => {
      refreshInFlight = null;
    });

  return refreshInFlight;
}

export function attachRefreshResponseInterceptor(client: AxiosInstance): void {
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const original = error.config as RetriableRequestConfig | undefined;
      const status = error.response?.status;

      const isRefreshCall = original?.url?.includes(endpoints.auth.refresh);
      const isLogoutCall = original?.url?.includes(endpoints.auth.logout);
      const hasAccessToken = !!useAuthStore.getState().accessToken;

      if (
        status === 401 &&
        original &&
        !original._retry &&
        !isRefreshCall &&
        !isLogoutCall &&
        hasAccessToken
      ) {
        original._retry = true;
        const newToken = await refreshAccessToken();
        if (!newToken) {
          return Promise.reject(error);
        }
        original.headers = original.headers ?? {};
        (original.headers as Record<string, string>)["Authorization"] =
          `Bearer ${newToken}`;
        return client.request(original);
      }
      return Promise.reject(error);
    },
  );
}
