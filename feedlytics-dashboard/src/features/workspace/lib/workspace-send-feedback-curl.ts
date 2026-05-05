import { workspaceSendFeedbackUrl } from "@/features/workspace/lib/workspace-send-feedback-url";

function joinCurl(lines: string[]): string {
  return lines.join("\n");
}

/** Full cURL for server-side calls; replace YOUR_API_KEY only. */
export function buildSendFeedbackCurlApi(workspacePublicId: string): string {
  const url = workspaceSendFeedbackUrl(workspacePublicId);
  const body = [
    "{",
    '  "content": "Example feedback",',
    '  "rating": 5,',
    '  "sourceType": "API_KEY"',
    "}",
  ].join("\n");
  return joinCurl([
    `curl -X POST '${url}' \\`,
    `  -H 'Content-Type: application/json' \\`,
    `  -H 'X-Feedlytics-Api-Key: YOUR_API_KEY' \\`,
    `  -d '${body}'`,
  ]);
}

/**
 * Browser-style call (e.g. local testing). Replace YOUR_WIDGET_SECRET and the Origin URL
 * (must match an origin saved in workspace Settings).
 */
export function buildSendFeedbackCurlWidget(workspacePublicId: string): string {
  const url = workspaceSendFeedbackUrl(workspacePublicId);
  const body = [
    "{",
    '  "content": "Example feedback",',
    '  "rating": 4,',
    '  "sourceType": "WIDGET"',
    "}",
  ].join("\n");
  return joinCurl([
    `curl -X POST '${url}' \\`,
    `  -H 'Content-Type: application/json' \\`,
    `  -H 'Origin: https://your-allowed-origin.example' \\`,
    `  -H 'X-Feedlytics-Widget-Secret: YOUR_WIDGET_SECRET' \\`,
    `  -d '${body}'`,
  ]);
}
