import {  User } from "next-auth";
import { getServerSideSession } from "@/config/getServerSideSession";
import { db } from "@/db/db";
import { feedbacksTable } from "@/db/models/feedback";
import { eq, sql } from "drizzle-orm";

export async function GET(request: Request) {
   const user = await getServerSideSession() as User

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
