import { stripe } from "@/lib/stripe";
import { userRepository } from "@/repositories/user.repository";
import { PLAN_LIMITS, getPlanForPrice, PlanTier } from "@/config/plans";
import { billingService } from "./billing.service";
import type Stripe from "stripe";

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const email = session.metadata?.email;
  if (!email) return;

  const subscriptionId = session.subscription as string;
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const priceId = subscription.items.data[0].price.id;
  const plan = getPlanForPrice(priceId);
  const tier: PlanTier = plan?.tier ?? "free";
  const limits = PLAN_LIMITS[tier];
  const newPeriod = billingService.computeNewBillingPeriod();

  await userRepository.updateByEmail(email, {
    stripeCustomerId: session.customer as string,
    stripeSubscriptionId: subscriptionId,
    userTier: tier,
    maxMessages: limits.maxFeedbacksPerMonth,
    maxWorkflows: limits.maxWorkflows,
    ...newPeriod,
  });

  const queueResponse = await fetch(
    `${process.env.SERVICES_URL}/get-payment-email`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: { email } }),
    }
  );

  if (!queueResponse.ok) {
    throw new Error("Failed to send email.");
  }
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  if (invoice.billing_reason === "subscription_create") return;

  const user = await userRepository.findByStripeCustomerId(customerId);
  if (user) {
    const newPeriod = billingService.computeNewBillingPeriod();
    await userRepository.updateByStripeCustomerId(customerId, newPeriod);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const priceId = subscription.items.data[0].price.id;
  const plan = getPlanForPrice(priceId);

  if (plan) {
    const limits = PLAN_LIMITS[plan.tier];
    await userRepository.updateByStripeCustomerId(customerId, {
      userTier: plan.tier,
      maxMessages: limits.maxFeedbacksPerMonth,
      maxWorkflows: limits.maxWorkflows,
    });
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  await userRepository.updateByStripeCustomerId(customerId, {
    userTier: "free",
    maxMessages: PLAN_LIMITS.free.maxFeedbacksPerMonth,
    maxWorkflows: PLAN_LIMITS.free.maxWorkflows,
    stripeSubscriptionId: null,
  });
}

const handlers: Record<string, (data: any) => Promise<void>> = {
  "checkout.session.completed": handleCheckoutCompleted,
  "invoice.paid": handleInvoicePaid,
  "customer.subscription.updated": handleSubscriptionUpdated,
  "customer.subscription.deleted": handleSubscriptionDeleted,
};

export const stripeWebhookService = {
  async handleStripeEvent(event: Stripe.Event) {
    const handler = handlers[event.type];
    if (handler) {
      await handler(event.data.object);
    }
  },
};
