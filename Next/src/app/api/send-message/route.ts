import { db } from "@/db/db";
import { feedbacksTable } from "@/db/models/feedback";
import { analyzeReview } from "./llm-functions";
import { eq, sql } from "drizzle-orm";
import { usersTable } from "@/db/models/user";

export async function POST(request: Request) {
  const { username, stars, content } = await request.json();

  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username))
      .limit(1);

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found." }),
        { status: 404 }
      );
    }
    if (!user.isAcceptingMessage) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `${username} is not accepting feedbacks.`,
        }),
        { status: 403 }
      );
    }
    if ((user?.messageCount as number) >= (user?.maxMessages as number)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `${username} has reached their feedback limit.`,
        }),
        { status: 400 }
      );
    }
    if (!content || content.length <= 10) {
      return new Response(
        JSON.stringify({ success: false, message: "Message too small." }),
        { status: 400 }
      );
    }
    if (content.length > 400) {
      return new Response(
        JSON.stringify({ success: false, message: "Message too large." }),
        { status: 400 }
      );
    }

    // Increment message count optimistically
    await db
      .update(usersTable)
      .set({ messageCount: sql`${usersTable.messageCount} + 1` })
      .where(eq(usersTable.id, user.id));

    try {
      // Analyze sentiment and feedback classification
      let sentimentData = await analyzeReview(content);
      if (!sentimentData) {
        sentimentData = {
          overall_sentiment: "neutral",
          feedback_classification: ["other"],
          review: content,
        };
        // throw new Error("Failed to analyze sentiment.");
      }

      const {
        overall_sentiment: sentiment,
        feedback_classification: category,
      } = sentimentData;

      // Insert feedback message
      await db.insert(feedbacksTable).values({
        userId: user.id,
        stars,
        content,
        sentiment,
        category,
        createdAt: new Date(),
      });

      return new Response(
        JSON.stringify({
          success: true,
          messageCount: (user?.messageCount as number) + 1,
          message: "Feedback sent successfully.",
        }),
        { status: 200 }
      );
    } catch (error) {
      // Rollback message count in case of failure
      await db
        .update(usersTable)
        .set({ messageCount: sql`${usersTable.messageCount} - 1` })
        .where(eq(usersTable.id, user.id));

      return new Response(
        JSON.stringify({
          success: false,
          message: error || "Failed to analyze sentiment.",
        }),
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error during request handling:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error.",
        error,
      }),
      { status: 500 }
    );
  }
}
