import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Use inter-docker proxy via Vite in dev (relative "/api"),
// but allow override via VITE_DASHBOARD_BASE_URL when embedding/production.
export const DASHBOARD_BASE_URL = import.meta.env.VITE_DASHBOARD_BASE_URL || "";

// Add helper to compute lighter shade of a hex color
export function lightenColor(color, percent) {
  // Assumes color in the format "#RRGGBB"
  let num = parseInt(color.slice(1), 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.min(255, Math.max(0, r + Math.round(2.55 * percent)));
  g = Math.min(255, Math.max(0, g + Math.round(2.55 * percent)));
  b = Math.min(255, Math.max(0, b + Math.round(2.55 * percent)));
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}