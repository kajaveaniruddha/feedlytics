/**
 * `withAuth` — decorator that asserts the caller holds an access token before
 * delegating. Thin guard for places that must not be invoked while logged out
 * (e.g. `/profile` fetchers mounted in the protected shell).
 *
 * The axios interceptor already injects the header; this decorator exists so
 * consumers get an immediate, typed rejection instead of a server 401 round-trip.
 */
import { ApiError } from "@/services/api/errors/ApiError";
import { useAuthStore } from "@/stores/auth.store";

type AsyncFn<TArgs extends unknown[], TReturn> = (...args: TArgs) => Promise<TReturn>;

export function withAuth<TArgs extends unknown[], TReturn>(
  fn: AsyncFn<TArgs, TReturn>,
): AsyncFn<TArgs, TReturn> {
  return async (...args: TArgs): Promise<TReturn> => {
    const { accessToken } = useAuthStore.getState();
    if (!accessToken) {
      throw new ApiError("NOT_AUTHENTICATED", "Not authenticated", 401);
    }
    return fn(...args);
  };
}
