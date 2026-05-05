/**
 * Two-letter initials for workspace tiles (Horizon-style picker).
 */
export function workspaceInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    const w = parts[0]!;
    return w.length === 1 ? w.toUpperCase() : w.slice(0, 2).toUpperCase();
  }
  const first = parts[0]!;
  const last = parts[parts.length - 1]!;
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase() || "?";
}
