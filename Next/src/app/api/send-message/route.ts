import { db } from "@/db/db";
import { eq, sql } from "drizzle-orm";
import { usersTable } from "@/db/models/user";
import { rateLimit } from "@/config/rateLimiter";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Custom rate limit: 5 requests per 10 seconds per IP
  const response= new NextResponse();
  const rateLimitResult = await rateLimit({
    request,
    response,
    ipLimit: 5,
    ipWindow: 10,
  });

  if (rateLimitResult) return rateLimitResult;

  const { username, stars, content, email, name } = await request.json();

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
      console.log(process.env.SERVICES_URL);
      const queueResponse = await fetch(
        `${process.env.SERVICES_URL}/add-feedback`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: {
              userId: user.id,
              email,
              name,
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

// New OPTIONS handler for CORS preflight
export function OPTIONS(request: Request) {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
