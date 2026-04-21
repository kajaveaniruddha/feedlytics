import { stripe } from "@/lib/stripe";
import { stripeWebhookService } from "@/services/stripe-webhook.service";
import { errorResponse, successResponse } from "@/lib/api-response";
import { withMetrics } from "@/lib/metrics";

async function handlePOST(request: Request) {
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

  try {
    await stripeWebhookService.handleStripeEvent(event);
    return successResponse({ received: true });
  } catch (err: any) {
    return errorResponse(err.message, 500);
  }
}

export const POST = withMetrics(handlePOST, "/api/stripe-webhook");
