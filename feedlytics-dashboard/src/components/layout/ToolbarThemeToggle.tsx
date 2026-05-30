"use client";

import { useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { IconButton } from "@/components/ui/icon-button";

function useMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/** Inline theme control for toolbars (no fixed/absolute positioning). */
export function ToolbarThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return (
      <IconButton
        label="Toggle theme"
        variant="ghost"
        size="icon-sm"
        className="text-secondary-gray-600 dark:text-secondary-gray-600"
      />
    );
  }

  const isDark = resolvedTheme === "dark";
  return (
    <IconButton
      label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      variant="ghost"
      size="icon-sm"
      className="text-secondary-gray-600 hover:text-navy-700 dark:hover:text-white"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <SunIcon className="size-[18px]" strokeWidth={2} /> : <MoonIcon className="size-[18px]" strokeWidth={2} />}
    </IconButton>
  );
}
