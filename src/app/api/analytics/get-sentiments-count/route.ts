import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { db } from "@/db/db";
import { feedbacksTable } from "@/db/models/feedback";
import { eq, sql } from "drizzle-orm";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session?.user) {
    return new Response(
      JSON.stringify({ success: false, message: "Not Authenticated." }),
      { status: 401 }
    );
  }

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
