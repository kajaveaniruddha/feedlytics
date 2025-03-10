import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const DASHBOARD_BASE_URL = import.meta.env.VITE_DASHBOARD_BASE_URL;