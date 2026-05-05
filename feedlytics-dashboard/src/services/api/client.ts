/**
 * Shared axios instance.
 *
 * - `withCredentials: true` so the browser sends the HttpOnly refresh cookie.
 * - Request interceptor injects the Bearer access token from the Zustand store.
 * - Response interceptor runs a *single-flight* refresh on 401 so N concurrent
 *   failed requests share one refresh call and then all retry.
 *
 * All errors surface as `ApiError` instances so callers don't touch Axios types.
 */
import axios, { AxiosHeaders } from "axios";
import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

import { env } from "@/config/env";
import { attachAuthRequestInterceptor } from "@/services/api/interceptors/auth.interceptor";
import { attachRefreshResponseInterceptor } from "@/services/api/interceptors/refresh.interceptor";
import {
  ApiError,
  type BackendErrorPayload,
} from "@/services/api/errors/ApiError";

export type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: env.apiBaseUrl,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
    timeout: 5000,
  });

  attachAuthRequestInterceptor(client);
  attachRefreshResponseInterceptor(client);

  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError<BackendErrorPayload>) => {
      return Promise.reject(ApiError.fromAxios(error));
    },
  );

  return client;
}

export const apiClient = createApiClient();

export { AxiosHeaders };
