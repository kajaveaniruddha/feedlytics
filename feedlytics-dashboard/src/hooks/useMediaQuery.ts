"use client";

import { useSyncExternalStore } from "react";

/**
 * SSR-safe `matchMedia` hook using `useSyncExternalStore`.
 *
 * Picking this API instead of useEffect + useState satisfies React 19's
 * `react-hooks/set-state-in-effect` rule and keeps hydration aligned between
 * server and client (server returns `false` by contract).
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = (notify: () => void) => {
    if (typeof window === "undefined") return () => {};
    const list = window.matchMedia(query);
    list.addEventListener("change", notify);
    return () => list.removeEventListener("change", notify);
  };

  const getSnapshot = () => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  };

  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
