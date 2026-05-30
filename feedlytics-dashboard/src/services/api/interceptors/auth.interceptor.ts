/**
 * Request interceptor — injects the in-memory access token into outgoing
 * requests. Reads the token synchronously from the Zustand store via
 * `useAuthStore.getState()` so the interceptor stays outside of React.
 */
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";

import { useAuthStore } from "@/stores/auth.store";

export function attachAuthRequestInterceptor(client: AxiosInstance): void {
  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return config;
  });
}
