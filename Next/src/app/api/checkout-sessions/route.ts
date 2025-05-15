import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getServerSideSession } from "@/config/getServerSideSession";

import { stripe } from "../../../lib/stripe";

export async function POST() {
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
    const headersList = await headers();
    const origin = headersList.get("origin");

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard?canceled=true`,
      metadata: {
        email: user.email,
      },
    });
    if (!session.url) throw new Error("Missing session URL");
    return NextResponse.redirect(session.url, 303);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    );
  }
}
