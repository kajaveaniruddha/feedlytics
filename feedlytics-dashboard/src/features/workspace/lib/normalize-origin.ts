/**
 * Client-side origin checks aligned with WorkspaceIntegrationServiceImpl (http/https, host only).
 */
export function normalizeOriginInput(raw: string):
  | { ok: true; value: string }
  | { ok: false; message: string } {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: false, message: "Origin cannot be empty" };
  }
  const withoutTrailingSlash = trimmed.replace(/\/$/, "");
  let url: URL;
  try {
    url = new URL(withoutTrailingSlash);
  } catch {
    return { ok: false, message: "Invalid origin URL" };
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return { ok: false, message: "Origin must use http or https" };
  }
  if (!url.hostname) {
    return { ok: false, message: "Origin must include a host" };
  }
  const path = url.pathname;
  if (path !== "" && path !== "/") {
    return { ok: false, message: "Origin must not include a path" };
  }
  if (url.search) {
    return { ok: false, message: "Origin must not include a query string" };
  }
  if (url.hash) {
    return { ok: false, message: "Origin must not include a fragment" };
  }
  if (withoutTrailingSlash.length > 512) {
    return { ok: false, message: "Origin is too long" };
  }
  return { ok: true, value: withoutTrailingSlash };
}
