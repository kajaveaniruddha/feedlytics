/** Human-readable top source category from API (often enum-like strings). */
export function formatTopCategoryDisplay(raw: string): string {
  const t = raw.trim();
  if (!t || t === "NONE") return "—";
  return t
    .toLowerCase()
    .split(/_/g)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
