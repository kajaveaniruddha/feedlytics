import { NextResponse } from "next/server";
import { db } from "@/db/db";
import { usersTable } from "@/db/models/user";
import { eq } from "drizzle-orm";
import { stripe } from "@/lib/stripe";
import { withMetrics } from "@/lib/metrics";
import { PLAN_LIMITS, getPlanForPrice, PlanTier } from "@/config/plans";

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
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const email = session.metadata?.email;
      if (!email) break;

      const subscriptionId = session.subscription as string;
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const priceId = subscription.items.data[0].price.id;
      const plan = getPlanForPrice(priceId);
      const tier: PlanTier = plan?.tier ?? "free";
      const limits = PLAN_LIMITS[tier];

      const now = new Date();
      await db
        .update(usersTable)
        .set({
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: subscriptionId,
          userTier: tier,
          maxMessages: limits.maxFeedbacksPerMonth,
          maxWorkflows: limits.maxWorkflows,
          messageCount: 0,
          billingPeriodStart: now,
          billingPeriodEnd: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        })
        .where(eq(usersTable.email, email));

      const queueResponse = await fetch(
        `${process.env.SERVICES_URL}/get-payment-email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: { email } }),
        }
      );

      if (!queueResponse.ok) {
        return new Response(
          JSON.stringify({ success: false, message: "Failed to send email." }),
          { status: 500 }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: "Subscription activated." }),
        { status: 201 }
      );
    }

    case "invoice.paid": {
      const invoice = event.data.object;
      const customerId = invoice.customer as string;

      // Skip the first invoice — already handled by checkout.session.completed
      if (invoice.billing_reason === "subscription_create") break;

      const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.stripeCustomerId, customerId))
        .limit(1);

      if (user) {
        const now = new Date();
        await db
          .update(usersTable)
          .set({
            messageCount: 0,
            billingPeriodStart: now,
            billingPeriodEnd: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
          })
          .where(eq(usersTable.stripeCustomerId, customerId));
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object;
      const customerId = subscription.customer as string;
      const priceId = subscription.items.data[0].price.id;
      const plan = getPlanForPrice(priceId);

      if (plan) {
        const limits = PLAN_LIMITS[plan.tier];
        await db
          .update(usersTable)
          .set({
            userTier: plan.tier,
            maxMessages: limits.maxFeedbacksPerMonth,
            maxWorkflows: limits.maxWorkflows,
          })
          .where(eq(usersTable.stripeCustomerId, customerId));
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const customerId = subscription.customer as string;

      await db
        .update(usersTable)
        .set({
          userTier: "free",
          maxMessages: PLAN_LIMITS.free.maxFeedbacksPerMonth,
          maxWorkflows: PLAN_LIMITS.free.maxWorkflows,
          stripeSubscriptionId: null,
        })
        .where(eq(usersTable.stripeCustomerId, customerId));
      break;
    }
  }

  return NextResponse.json({ received: true });
}

export const POST = withMetrics(handlePOST, "/api/stripe-webhook");
