/**
 * `user.store` — a synchronous mirror of the `['user','me']` TanStack Query
 * cache. Layout shells that must read the user name / avatar *synchronously*
 * (sidebar, navbar) select from this store instead of calling `useQuery` in
 * every render tree and paying dedup-cost.
 *
 * Kept in sync by the `useCurrentUser` hook's `onSuccess` handler. Never
 * persisted — on refresh the mirror is rebuilt from the query cache.
 */
import { create } from "zustand";

import type { UserProfile } from "@/features/user/types/user.types";

type UserState = {
  profile: UserProfile | null;
};

type UserActions = {
  setProfile: (profile: UserProfile | null) => void;
};

export const useUserStore = create<UserState & UserActions>()((set) => ({
  profile: null,
  setProfile(profile) {
    set({ profile });
  },
}));

export const useCurrentUserProfile = () => useUserStore((s) => s.profile);
