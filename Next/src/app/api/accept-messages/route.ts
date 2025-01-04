import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { usersTable } from "@/db/models/user";
import { db } from "@/db/db";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response(
      JSON.stringify({ success: false, message: "Not Authenticated." }),
      { status: 401 }
    );
  }

  try {
    const user = await db
      .select({ isAcceptingMessage: usersTable.isAcceptingMessage })
      .from(usersTable)
      .where(eq(usersTable.id, parseInt(session.user.id ?? "0")))
      .limit(1);

    if (user.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found." }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        isAcceptingMessages: user[0].isAcceptingMessage,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch accept messages status.", error);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to fetch status." }),
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response(
      JSON.stringify({ success: false, message: "Not Authenticated." }),
      { status: 401 }
    );
  }

  const { acceptMessages } = await request.json();

  try {
    const updateResult = await db
      .update(usersTable)
      .set({ isAcceptingMessage: acceptMessages })
      .where(eq(usersTable.id, parseInt(session.user.id ?? "0")));

    if (!updateResult.rowCount) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Failed to update user message acceptance status.",
        }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Message acceptance status updated successfully.",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update user message acceptance status.", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to update status.",
      }),
      { status: 500 }
    );
  }
}
