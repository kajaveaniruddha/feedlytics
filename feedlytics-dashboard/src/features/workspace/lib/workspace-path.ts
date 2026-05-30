/** Active workspace publicId from URL (`/workspaces/:publicId/...`). */
export function workspacePublicIdFromPathname(pathname: string): string | null {
  const plural = /^\/workspaces\/([^/]+)/.exec(pathname);
  if (plural?.[1]) return plural[1];
  return null;
}
