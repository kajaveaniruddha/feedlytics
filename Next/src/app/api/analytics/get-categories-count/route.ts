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
    // Unnest categories and aggregate counts
    const categoryCounts = await db
      .select({
        category: sql`unnest(${feedbacksTable.category})`.as("category"),
        count: sql`COUNT(*)`,
      })
      .from(feedbacksTable)
      .where(eq(feedbacksTable.userId, parseInt(user.id ?? "0")))
      .groupBy(sql`unnest(${feedbacksTable.category})`);
      
    return new Response(
      JSON.stringify({ success: true, categoryCounts }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error aggregating categories:", error);
    return new Response(
      JSON.stringify({ success: false, message: "An error occurred.", error }),
      { status: 500 }
    );
  }
}
