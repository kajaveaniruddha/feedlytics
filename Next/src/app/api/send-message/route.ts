import { withMetrics } from "@/lib/metrics";
import { createHandler } from "@/lib/route-handler";
import { corsSuccessResponse, corsOptionsResponse } from "@/lib/api-response";
import { messageService } from "@/services/message.service";

const handlePOST = createHandler(
  async (request: Request) => {
    const { username, stars, content, email, name } = await request.json();
    const result = await messageService.sendFeedback({ username, stars, content, email, name });
    return corsSuccessResponse({ messageCount: result.messageCount, message: "Feedback sent successfully." });
  },
  { cors: true }
);

function handleOPTIONS() {
  return corsOptionsResponse();
}

export const POST = withMetrics(handlePOST, "/api/send-message");
export const OPTIONS = withMetrics(handleOPTIONS, "/api/send-message");
