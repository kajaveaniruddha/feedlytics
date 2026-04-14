import { withMetrics } from "@/lib/metrics";
import { createHandler } from "@/lib/route-handler";
import { corsSuccessResponse, corsOptionsResponse } from "@/lib/api-response";
import { userRepository } from "@/repositories/user.repository";

const handleOPTIONS = createHandler(async () => {
  return corsOptionsResponse();
});

const handlePOST = createHandler(
  async (request: Request) => {
    const { username } = await request.json();

    const user = await userRepository.findByUsername(username);

    const response = {
      bg_color: user?.bgColor || "#ffffff",
      text_color: user?.textColor || "#000000",
      collect_info: {
        name: user?.collectName ?? false,
        email: user?.collectEmail ?? true,
      },
    };

    return corsSuccessResponse(response);
  },
  { cors: true }
);

export const OPTIONS = withMetrics(handleOPTIONS, "/api/get-widget-settings");
export const POST = withMetrics(handlePOST, "/api/get-widget-settings");
