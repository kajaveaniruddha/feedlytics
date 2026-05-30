/**
 * Shared API envelope shapes.
 *
 * The Kotlin `GlobalExceptionHandler` always returns errors as:
 *   { success: false, error: { code, message } }
 *
 * Successful responses from domain controllers typically include a `success: true`
 * discriminant plus the payload. We mirror both here.
 */
export type Success<T> = T & { success?: true };

export type BackendError = {
  success: false;
  error: {
    code: string;
    message: string;
  };
};

export type Paged<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};
