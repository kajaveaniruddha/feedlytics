import { User } from "next-auth";
import { getServerSideSession } from "@/config/getServerSideSession";
import { db } from "@/db/db";
import { feedbacksTable } from "@/db/models/feedback";
import { usersTable } from "@/db/models/user";
import { eq, sql } from "drizzle-orm";

export async function GET(request: Request) {
  const user = (await getServerSideSession()) as User;
  const userId = parseInt(user.id ?? "0");

  if (!userId) {
    return new Response(
      JSON.stringify({ success: false, message: "Invalid user ID." }),
      { status: 400 }
    );
  }

  try {
    // Fetch category counts
    const categoryCounts = await db
      .select({
        category: sql`unnest(${feedbacksTable.category})`.as("category"),
        count: sql`COUNT(*)`,
      })
      .from(feedbacksTable)
      .where(eq(feedbacksTable.userId, userId))
      .groupBy(sql`unnest(${feedbacksTable.category})`);

    // Fetch user details
    const userDetails = await db
      .select({
        name: usersTable.name,
        messageCount: usersTable.messageCount,
        maxMessages: usersTable.maxMessages,
      })
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (!userDetails.length) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found." }),
        { status: 404 }
      );
    }

    const { name, messageCount, maxMessages } = userDetails[0];

    // Fetch sentiment counts
    const sentimentCounts = await db
      .select({
        sentiment: feedbacksTable.sentiment,
        count: sql`COUNT(${feedbacksTable.sentiment})`,
      })
      .from(feedbacksTable)
      .where(eq(feedbacksTable.userId, userId))
      .groupBy(feedbacksTable.sentiment);

    const counts = {
      positive: 0,
      negative: 0,
      neutral: 0,
    };

    sentimentCounts.forEach((item) => {
      counts[item.sentiment as keyof typeof counts] = Number(item.count);
    });

    // Add ratings count query
    const ratingsCount = await db
      .select({
        rating: feedbacksTable.stars,
        count: sql`COUNT(${feedbacksTable.stars})`,
      })
      .from(feedbacksTable)
      .where(eq(feedbacksTable.userId, userId))
      .groupBy(feedbacksTable.stars);

    return new Response(
      JSON.stringify({
        success: true,
        userDetails: { name, messageCount, maxMessages },
        categoryCounts,
        sentimentCounts: counts,
        ratingsCount, // Add ratings to response
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return new Response(
      JSON.stringify({ success: false, message: "An error occurred.", error }),
      { status: 500 }
    );
  }
}
