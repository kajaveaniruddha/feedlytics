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
