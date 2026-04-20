import { createHandler } from "@/lib/route-handler";
import { corsSuccessResponse, corsOptionsResponse } from "@/lib/api-response";
import { messageService } from "@/services/message.service";
import { withMetrics } from "@/lib/metrics";
import { rateLimit } from "@/config/rateLimiter";
import { NextRequest, NextResponse } from "next/server";
import { validateBody } from "@/lib/validate";
import { SendMessageSchema } from "@/schemas/sendMessageSchema";

const handlePOST = createHandler(
  async (request: Request) => {
    const rateLimitResult = await rateLimit({
      request: request as NextRequest,
      response: new NextResponse(),
      ipLimit: 5,
      ipWindow: 10,
    });
    if (rateLimitResult) return rateLimitResult;

    const { username, stars, content, email, name } = await validateBody(request, SendMessageSchema);

    const result = await messageService.sendFeedback({
      username,
      stars,
      content,
      email: email ?? undefined,
      name,
    });

    return corsSuccessResponse({
      messageCount: result.messageCount,
      message: "Feedback sent successfully.",
    });
  },
  { cors: true }
);

const handleOPTIONS = createHandler(async () => {
  return corsOptionsResponse();
});

export const POST = withMetrics(handlePOST, "/api/send-message");
export const OPTIONS = withMetrics(handleOPTIONS, "/api/send-message");
