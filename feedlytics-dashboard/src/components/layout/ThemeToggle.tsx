"use client";

import { useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { IconButton } from "@/components/ui/icon-button";

// Subscribe to document presence so SSR renders a neutral placeholder until
// the client hydrates, avoiding a class-mismatch hydration warning with
// next-themes. useSyncExternalStore sidesteps the lint rule against setState
// inside effects while giving us deterministic SSR output.
function useMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return <IconButton label="Toggle theme" variant="ghost" size="icon-sm" />;
  }

  const isDark = resolvedTheme === "dark";
  return (
      <IconButton
        label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        variant="ghost"
        size="icon-sm"
        className="absolute bottom-10 left-10"
        onClick={() => setTheme(isDark ? "light" : "dark")}
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </IconButton>
  );
}
