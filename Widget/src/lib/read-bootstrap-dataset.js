/**
 * Merge data-workspace-public-id / data-widget-secret from the <script> that loads this bundle
 * into window.feedlytics_widget (cfg).
 *
 * document.currentScript is set for classic scripts only. Vite dev uses type="module", where
 * currentScript is null, so we locate the script tag by src (main.jsx or feedlytics_widget.js).
 */
export function applyWidgetScriptDataset(cfg) {
  const hasAnyDataset = (el) =>
    el?.dataset &&
    (Boolean(el.dataset.workspacePublicId?.trim()) || Boolean(el.dataset.widgetSecret?.trim()));

  let el = document.currentScript;
  if (!hasAnyDataset(el)) {
    for (const script of document.querySelectorAll("script[src]")) {
      if (!hasAnyDataset(script)) continue;
      const src = script.getAttribute("src") || "";
      if (
        src.includes("feedlytics_widget") ||
        src.includes("main.jsx") ||
        src.includes("/src/main")
      ) {
        el = script;
        break;
      }
    }
  }

  if (!el?.dataset) return;

  const id = el.dataset.workspacePublicId?.trim();
  const secret = el.dataset.widgetSecret?.trim();
  if (id) cfg.workspacePublicId = id;
  if (secret) cfg.widgetSecret = secret;
}
