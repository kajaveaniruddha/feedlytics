import { withMetrics } from "@/lib/metrics";
import { createHandler } from "@/lib/route-handler";
import { validateBody } from "@/lib/validate";
import { checkoutSessionSchema } from "@/schemas/checkoutSessionSchema";
import { successResponse } from "@/lib/api-response";
import { authService } from "@/services/auth.service";
import { userRepository } from "@/repositories/user.repository";
import { usersTable } from "@/db/models/user";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { ApiError } from "@/lib/api-error";

const handlePOST = createHandler(async (request: Request) => {
  const user = await authService.requireAuth();
  if (!user.email) {
    throw ApiError.badRequest("Missing user email.");
  }

  const { plan, interval } = await validateBody(request, checkoutSessionSchema);

  const priceId = process.env[`STRIPE_PRICE_${plan.toUpperCase()}_${interval.toUpperCase()}`];
  if (!priceId) {
    throw ApiError.badRequest("Price not configured for this plan.");
  }

  const headersList = await headers();
  const origin = headersList.get("origin");

  const dbUser = await userRepository.selectFieldsByEmail(user.email, {
    stripeCustomerId: usersTable.stripeCustomerId,
  });

  const sessionParams: any = {
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/dashboard?canceled=true`,
    metadata: { email: user.email },
  };

  if (dbUser?.stripeCustomerId) {
    sessionParams.customer = dbUser.stripeCustomerId;
  } else {
    sessionParams.customer_email = user.email;
  }

  const session = await stripe.checkout.sessions.create(sessionParams);

  return successResponse({ url: session.url });
});

export const POST = withMetrics(handlePOST, "/api/checkout-sessions");
