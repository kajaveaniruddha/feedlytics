/**
 * Validates `next` from query params so we only redirect to same-app paths.
 * Rejects protocol-relative URLs, absolute URLs, and non-path values.
 */
export function sanitizeInternalNextPath(next: string | null): string | null {
  if (next == null || typeof next !== "string") return null;
  const trimmed = next.trim();
  if (!trimmed.startsWith("/")) return null;
  if (trimmed.startsWith("//")) return null;
  if (trimmed.includes("://")) return null;
  return trimmed;
}
