import { User } from "next-auth";
import { getServerSideSession } from "@/config/getServerSideSession";
import { db } from "@/db/db";
import { feedbacksTable } from "@/db/models/feedback";
import { eq, sql } from "drizzle-orm";

export async function GET(request: Request) {
   const user = await getServerSideSession() as User

  try {
    const sentimentCounts = await db
      .select({
        sentiment: feedbacksTable.sentiment,
        count: sql`COUNT(${feedbacksTable.sentiment})`,
      })
      .from(feedbacksTable)
      .where(eq(feedbacksTable.userId, parseInt(user.id ?? "0")))
      .groupBy(feedbacksTable.sentiment);

    const counts = {
      positive: 0,
      negative: 0,
      neutral: 0,
    };

    sentimentCounts.forEach((item) => {
      counts[item.sentiment as keyof typeof counts] = Number(item.count);
    });

    return new Response(JSON.stringify({ success: true, counts }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error aggregating sentiments:", error);
    return new Response(
      JSON.stringify({ success: false, message: "An error occurred.", error }),
      { status: 500 }
    );
  }
}
