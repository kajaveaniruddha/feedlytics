import { NextResponse } from "next/server";
import { db } from "@/db/db";
import { usersTable } from "@/db/models/user";
import { eq } from "drizzle-orm";
import { stripe } from "@/lib/stripe";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const email = session.metadata?.email;
    if (email) {
      // Scalable plan upgrade logic
      const plan = "premium";
      const planHierarchy: { [key: string]: number } = {
        free: 0,
        premium: 1,
      };
      const planUpdates: {
        [key: string]: { maxMessages: number; maxWorkflows: number };
      } = {
        premium: {
          maxMessages: 100,
          maxWorkflows: 10,
        },
      };
      const user = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email));
      if (user && user.length > 0) {
        const currentUser = user[0];
        const currentTier = currentUser.userTier || "free";
        if (planHierarchy[currentTier] < planHierarchy[plan]) {
          const updates = planUpdates[plan];
          if (updates) {
            await db
              .update(usersTable)
              .set({ userTier: plan, ...updates })
              .where(eq(usersTable.email, email));
          }
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
