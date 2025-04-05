import { db } from "@/db/db";
import { eq, sql } from "drizzle-orm";
import { usersTable } from "@/db/models/user";

export async function POST(request: Request) {
  // Handle preflight OPTIONS request
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

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
        {
          status: 404,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }
    if (!user.isAcceptingMessage) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `${username} is not accepting feedbacks.`,
        }),
        {
          status: 403,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }
    if ((user?.messageCount as number) >= (user?.maxMessages as number)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `${username} has reached their feedback limit.`,
        }),
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }
    if (!content || content.length <= 10) {
      return new Response(
        JSON.stringify({ success: false, message: "Message too small." }),
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }
    if (content.length > 400) {
      return new Response(
        JSON.stringify({ success: false, message: "Message too large." }),
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Increment message count optimistically
    await db
      .update(usersTable)
      .set({ messageCount: sql`${usersTable.messageCount} + 1` })
      .where(eq(usersTable.id, user.id));

    try {
      const queueResponse = await fetch(
        `${process.env.SERVICES_URL}/add-feedback`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: {
              userId: user.id,
              stars,
              content,
              createdAt: new Date(),
            },
          }),
        }
      );

      if (!queueResponse.ok) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "Failed to add job to the queue.",
          }),
          {
            status: 500,
            headers: {
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          messageCount: (user?.messageCount as number) + 1,
          message: "Feedback sent successfully.",
        }),
        {
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
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
        {
          status: 500,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
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
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}
