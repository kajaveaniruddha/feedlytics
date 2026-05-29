/** CDN script URL for the embeddable feedback widget (production). */
export const WIDGET_EMBED_SCRIPT_SRC = "https://widget.feedlytics.in/feedlytics_widget.js";

/**
 * HTML snippet for pasting on a customer site. Workspace id is fixed per page; integrator replaces the secret placeholder.
 */
export function buildWidgetEmbedHtmlSnippet(workspacePublicId: string): string {
  return `<script
  defer
  src="${WIDGET_EMBED_SCRIPT_SRC}"
  data-workspace-public-id="${workspacePublicId}"
  data-widget-secret="YOUR-WIDGET-SECRET"
></script>`;
}
