import { createHandler } from "@/lib/route-handler";
import { successResponse } from "@/lib/api-response";
import { userRepository } from "@/repositories/user.repository";
import { ApiError } from "@/lib/api-error";
import { withMetrics } from "@/lib/metrics";

const handlePOST = createHandler(async (request: Request) => {
  const { username, code } = await request.json();
  const decodedUsername = decodeURIComponent(username);

  const user = await userRepository.findByUsername(decodedUsername);
  if (!user) {
    throw ApiError.badRequest("User not found.");
  }

  const isCodeValid = user.verifyCode === code;
  const isCodeNotExpired = new Date(user.verifyCodeExpiry!) > new Date();

  if (!isCodeValid || !isCodeNotExpired) {
    const errorMessage = !isCodeNotExpired
      ? "Code has expired, please sign up again."
      : "Incorrect verification code.";
    throw ApiError.badRequest(errorMessage);
  }

  await userRepository.updateByEmail(user.email, { isVerified: true });

  return successResponse({ message: "Account verified." });
});

export const POST = withMetrics(handlePOST, "/api/verify-code");
