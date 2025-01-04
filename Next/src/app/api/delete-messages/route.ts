import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { usersTable } from "@/db/models/user";
import { db } from "@/db/db";
import { eq, sql } from "drizzle-orm";

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response(
      JSON.stringify({ success: false, message: "Not Authenticated." }),
      { status: 401 }
    );
  }

  try {
    const { messageIds } = await request.json();

    if (!Array.isArray(messageIds) || messageIds.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "No messages specified." }),
        { status: 400 }
      );
    }

    const objectIds = messageIds.map((id) => parseInt(id, 10));

    const updateResult = await db
      .update(usersTable)
      .set({
        messageCount: sql`${usersTable.messageCount} - ${objectIds.length}`,
      })
      .where(eq(usersTable.id, parseInt(session?.user?.id as string, 10)));

    if (!updateResult.rowCount) {
      return new Response(
        JSON.stringify({ success: false, message: "Messages not found." }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Messages deleted successfully.",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting messages:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error deleting messages.",
      }),
      { status: 500 }
    );
  }
}
