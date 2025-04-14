import { User } from "next-auth";
import { db } from "@/db/db";
import { usersTable } from "@/db/models/user";
import { eq } from "drizzle-orm";
import { getServerSideSession } from "@/config/getServerSideSession";

export async function GET(request: Request) {
  const user = (await getServerSideSession()) as User;

  try {
    const userDetails = await db
      .select({
        name: usersTable.name,
        avatar_url: usersTable.avatarUrl,
        messageCount: usersTable.messageCount,
        maxMessages: usersTable.maxMessages,
        maxWorkflows: usersTable.maxWorkflows,
        textColor: usersTable.textColor,
        bgColor: usersTable.bgColor,
        collectName: usersTable.collectName,
        collectEmail: usersTable.collectEmail,
      })
      .from(usersTable)
      .where(eq(usersTable.id, parseInt(user.id ?? "0")))
      .limit(1);

    if (!userDetails.length) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found." }),
        { status: 404 }
      );
    }

    const {
      name,
      avatar_url,
      messageCount,
      maxMessages,
      maxWorkflows,
      bgColor,
      collectEmail,
      collectName,
      textColor,
    } = userDetails[0];

    return new Response(
      JSON.stringify({
        success: true,
        messageCount,
        maxMessages,
        maxWorkflows,
        userDetails: {
          name,
          avatar_url,
          bgColor,
          collectEmail,
          collectName,
          textColor,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user details:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Couldn't find user.", error }),
      { status: 500 }
    );
  }
}
