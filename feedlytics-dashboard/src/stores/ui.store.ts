/**
 * `ui.store` — purely local UI state that would otherwise require prop
 * drilling through layout shells. Sidebar open, command palette open, etc.
 * Must never contain data fetched from the backend.
 */
import { create } from "zustand";

type UiState = {
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;
};

type UiActions = {
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
};

export const useUiStore = create<UiState & UiActions>()((set) => ({
  sidebarOpen: true,
  commandPaletteOpen: false,

  setSidebarOpen(open) {
    set({ sidebarOpen: open });
  },

  toggleSidebar() {
    set((s) => ({ sidebarOpen: !s.sidebarOpen }));
  },

  setCommandPaletteOpen(open) {
    set({ commandPaletteOpen: open });
  },
}));

export const useSidebarOpen = () => useUiStore((s) => s.sidebarOpen);
export const useCommandPaletteOpen = () => useUiStore((s) => s.commandPaletteOpen);
