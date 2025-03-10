import { User } from "next-auth";
import { db } from "@/db/db";
import { feedbacksTable } from "@/db/models/feedback";
import { eq, sql, desc } from "drizzle-orm";
import { getServerSideSession } from "@/config/getServerSideSession";

export async function GET(request: Request) {
   const user = await getServerSideSession() as User

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const rating = parseInt(url.searchParams.get("rating") || "0", 10);
  const limit = 10;
  const offset = (page - 1) * limit;

  try {
    const messagesQuery = db
      .select()
      .from(feedbacksTable)
      .where(eq(feedbacksTable.userId, parseInt(user?.id ?? "0")))
      .orderBy(desc(feedbacksTable.createdAt)) // Use "desc" for descending order
      // .limit(limit)
      // .offset(offset);

    const totalCountQuery = db
      .select({ count: sql`COUNT(*)` })
      .from(feedbacksTable)
      .where(eq(feedbacksTable.userId, parseInt(user.id ?? "0")));

    const [messages, totalCountResult] = await Promise.all([
      messagesQuery,
      totalCountQuery,
    ]);

    return new Response(
      JSON.stringify({
        success: true,
        messages,
        messagesFound: totalCountResult[0]?.count || 0,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving messages:", error);
    return new Response(
      JSON.stringify({ success: false, message: "An error occurred.", error }),
      { status: 500 }
    );
  }
}
