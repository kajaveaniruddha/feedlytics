import { User } from "next-auth";
import { db } from "@/db/db";
import { usersTable } from "@/db/models/user";
import { eq } from "drizzle-orm";
import { getServerSideSession } from "@/config/getServerSideSession";
import { withMetrics } from "@/lib/metrics";

async function handleGET(request: Request) {
  const sessionResult = await getServerSideSession();
  if (sessionResult instanceof Response) return sessionResult;
  const user = sessionResult as User;

  try {
    const userDetails = await db
      .select({
        name: usersTable.name,
        userTier: usersTable.userTier,
        avatar_url: usersTable.avatarUrl,
        messageCount: usersTable.messageCount,
        maxMessages: usersTable.maxMessages,
        maxWorkflows: usersTable.maxWorkflows,
        textColor: usersTable.textColor,
        bgColor: usersTable.bgColor,
        collectName: usersTable.collectName,
        collectEmail: usersTable.collectEmail,
        billingPeriodStart: usersTable.billingPeriodStart,
        billingPeriodEnd: usersTable.billingPeriodEnd,
      })
      .from(usersTable)
      .where(eq(usersTable.id, parseInt(user.id ?? "0")))
      .limit(1);

    if (!userDetails.length) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found." }),
        { status: 404 }
      );
    }

    const {
      name,
      userTier,
      avatar_url,
      messageCount,
      maxMessages,
      maxWorkflows,
      bgColor,
      collectEmail,
      collectName,
      textColor,
      billingPeriodStart,
      billingPeriodEnd,
    } = userDetails[0];

    return new Response(
      JSON.stringify({
        success: true,
        messageCount,
        maxMessages,
        maxWorkflows,
        billingPeriodStart,
        billingPeriodEnd,
        userDetails: {
          name,
          userTier,
          avatar_url,
          bgColor,
          collectEmail,
          collectName,
          textColor,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user details:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Couldn't find user.", error }),
      { status: 500 }
    );
  }
}

export const GET = withMetrics(handleGET, "/api/get-project-details");
