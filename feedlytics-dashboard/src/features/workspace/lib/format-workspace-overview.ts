import { displayCategoryLabel } from "@/features/workspace/lib/overview-distribution";

/** Top category label from API (`NONE` when unset); preserves workspace-defined names as-is. */
export function formatTopCategoryDisplay(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed || trimmed === "NONE") return "—";
  return displayCategoryLabel(trimmed);
}
