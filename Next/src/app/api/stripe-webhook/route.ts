import { withMetrics } from "@/lib/metrics";
import { createHandler } from "@/lib/route-handler";
import { successResponse, errorResponse } from "@/lib/api-response";
import { stripe } from "@/lib/stripe";
import { stripeWebhookService } from "@/services/stripe-webhook.service";

const handlePOST = createHandler(async (request: Request) => {
  const sig = request.headers.get("stripe-signature");

  let event;
  try {
    const rawBody = await request.arrayBuffer();
    event = stripe.webhooks.constructEvent(
      Buffer.from(rawBody),
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return errorResponse(`Webhook Error: ${err.message}`, 400);
  }

  await stripeWebhookService.handleStripeEvent(event);

  return successResponse({ received: true });
});

export const POST = withMetrics(handlePOST, "/api/stripe-webhook");
