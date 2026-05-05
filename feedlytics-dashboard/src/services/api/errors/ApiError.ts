/**
 * Normalized API error.
 *
 * Maps the Kotlin `GlobalExceptionHandler` response shape
 *   { success: false, error: { code: string, message: string } }
 * into a single class the frontend can instanceof-check in mutation onError.
 */
import type { AxiosError } from "axios";

export type BackendErrorPayload = {
  success?: false;
  error?: {
    code?: string;
    message?: string;
  };
};

export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly fields?: Record<string, string>;

  constructor(
    code: string,
    message: string,
    status: number,
    fields?: Record<string, string>,
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.fields = fields;
  }

  static fromAxios(err: AxiosError<BackendErrorPayload>): ApiError {
    const status = err.response?.status ?? 0;
    const payload = err.response?.data;
    const code = payload?.error?.code ?? (status ? `HTTP_${status}` : "NETWORK_ERROR");
    const message =
      payload?.error?.message ??
      err.message ??
      (status === 0 ? "Network error — check your connection" : "Request failed");
    return new ApiError(code, message, status, parseValidationFields(message));
  }

  isValidationError(): boolean {
    return this.code === "VALIDATION_ERROR";
  }

  isUnauthorized(): boolean {
    return this.status === 401;
  }

  isConflict(): boolean {
    return this.status === 409;
  }
}

/**
 * Kotlin's validation handler collapses every field error into a flat string:
 *   "email: must be a well-formed email address, password: must not be blank"
 * We re-parse that into { email: "...", password: "..." } so RHF can
 * `form.setError(field, message)` one-by-one.
 */
function parseValidationFields(message: string): Record<string, string> | undefined {
  if (!message.includes(":")) return undefined;
  const entries = message
    .split(/,\s*/)
    .map((chunk) => chunk.split(/:\s+/, 2))
    .filter((pair): pair is [string, string] => pair.length === 2);
  if (entries.length === 0) return undefined;
  return Object.fromEntries(entries);
}
