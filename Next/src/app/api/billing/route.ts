import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/db/db";
import { usersTable } from "@/db/models/user";
import { feedbacksTable } from "@/db/models/feedback";
import { userWorkFlowsTable } from "@/db/models/workflows";
import { eq, sql, and, gte } from "drizzle-orm";
import { getServerSideSession } from "@/config/getServerSideSession";
import { stripe } from "@/lib/stripe";
import { withMetrics } from "@/lib/metrics";
import { User } from "next-auth";

async function handleGET() {
  const sessionResult = await getServerSideSession();
  if (sessionResult instanceof Response) return sessionResult;
  const user = sessionResult as User;
  const userId = parseInt(user.id ?? "0");

  try {
    const [[billing], [workflowCount]] = await Promise.all([
      db
        .select({
          userTier: usersTable.userTier,
          messageCount: usersTable.messageCount,
          maxMessages: usersTable.maxMessages,
          maxWorkflows: usersTable.maxWorkflows,
          billingPeriodStart: usersTable.billingPeriodStart,
          billingPeriodEnd: usersTable.billingPeriodEnd,
          stripeCustomerId: usersTable.stripeCustomerId,
          stripeSubscriptionId: usersTable.stripeSubscriptionId,
        })
        .from(usersTable)
        .where(eq(usersTable.id, userId))
        .limit(1),
      db
        .select({ count: sql<number>`count(*)` })
        .from(userWorkFlowsTable)
        .where(eq(userWorkFlowsTable.userId, userId)),
    ]);

    if (!billing) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    let periodFeedbackCount = 0;
    if (billing.billingPeriodStart) {
      const [periodCount] = await db
        .select({ count: sql<number>`count(*)` })
        .from(feedbacksTable)
        .where(
          and(
            eq(feedbacksTable.userId, userId),
            gte(feedbacksTable.createdAt, billing.billingPeriodStart)
          )
        );
      periodFeedbackCount = Number(periodCount.count);
    }

    return NextResponse.json({
      success: true,
      ...billing,
      workflowCount: Number(workflowCount.count),
      periodFeedbackCount,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

async function handlePOST() {
  const sessionResult = await getServerSideSession();
  if (sessionResult instanceof Response) return sessionResult;
  const user = sessionResult as User;
  const userId = parseInt(user.id ?? "0");

  try {
    const [dbUser] = await db
      .select({ stripeCustomerId: usersTable.stripeCustomerId })
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (!dbUser?.stripeCustomerId) {
      return NextResponse.json(
        { success: false, message: "No billing account found." },
        { status: 400 }
      );
    }

    const headersList = await headers();
    const origin = headersList.get("origin");

    const session = await stripe.billingPortal.sessions.create({
      customer: dbUser.stripeCustomerId,
      return_url: `${origin}/settings`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export const GET = withMetrics(handleGET, "/api/billing");
export const POST = withMetrics(handlePOST, "/api/billing");
