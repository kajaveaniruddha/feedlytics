import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
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
    const ratingData = await db
      .select({
        stars: feedbacksTable.stars,
        createdAt: sql`TO_CHAR(${feedbacksTable.createdAt}, 'YYYY-MM-DD')`.as(
          "createdAt"
        ),
      })
      .from(feedbacksTable)
      .where(eq(feedbacksTable.userId, parseInt(user?.id ?? "0")));

    // Format the output
    const ratingsArray = ratingData.map((item) => ({
      stars: `${item.stars}star`,
      createdAt: item.createdAt,
    }));

    return new Response(
      JSON.stringify({ success: true, ratings: ratingsArray }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching rating data:", error);
    return new Response(
      JSON.stringify({ success: false, message: "An error occurred.", error }),
      { status: 500 }
    );
  }
}
