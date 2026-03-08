import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getServerSideSession } from "@/config/getServerSideSession";
import { withMetrics } from "@/lib/metrics";
import { db } from "@/db/db";
import { usersTable } from "@/db/models/user";
import { eq } from "drizzle-orm";
import { stripe } from "@/lib/stripe";

async function handlePOST(request: Request) {
  try {
    const LoggedInUser = await getServerSideSession();
    if (LoggedInUser instanceof Response) {
      return LoggedInUser;
    }
    const user = LoggedInUser;
    if (!user.email) {
      return NextResponse.json(
        { error: "Missing user email." },
        { status: 400 }
      );
    }

    const { plan, interval } = await request.json();

    if (!["pro", "business"].includes(plan) || !["monthly", "yearly"].includes(interval)) {
      return NextResponse.json(
        { error: "Invalid plan or interval." },
        { status: 400 }
      );
    }

    const priceId = process.env[`STRIPE_PRICE_${plan.toUpperCase()}_${interval.toUpperCase()}`];
    if (!priceId) {
      return NextResponse.json(
        { error: "Price not configured for this plan." },
        { status: 400 }
      );
    }

    const headersList = await headers();
    const origin = headersList.get("origin");

    const [dbUser] = await db
      .select({ stripeCustomerId: usersTable.stripeCustomerId })
      .from(usersTable)
      .where(eq(usersTable.email, user.email))
      .limit(1);

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

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    );
  }
}

export const POST = withMetrics(handlePOST, "/api/checkout-sessions");
