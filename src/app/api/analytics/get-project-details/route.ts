import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { db } from "@/db/db";
import { usersTable } from "@/db/models/user";
import { eq } from "drizzle-orm";

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
    const userDetails = await db
      .select({
        name: usersTable.name,
        messageCount: usersTable.messageCount,
        maxMessages: usersTable.maxMessages,
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

    const { name, messageCount, maxMessages } = userDetails[0];

    return new Response(
      JSON.stringify({
        success: true,
        messageCount,
        maxMessages,
        userDetails: { name, messageCount, maxMessages },
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
