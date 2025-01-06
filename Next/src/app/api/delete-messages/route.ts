import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { usersTable } from "@/db/models/user";
import { feedbacksTable } from "@/db/models/feedback";
import { db } from "@/db/db";
import { eq, sql, inArray } from "drizzle-orm";

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

    const userId = parseInt(session.user.id as string, 10);
    const objectIds = messageIds.map((id) => parseInt(id, 10));

    console.log("Message IDs to delete:", objectIds);

    // Step 1: Delete messages from feedbacks table
    const deleteResult = await db
      .delete(feedbacksTable)
      .where(inArray( feedbacksTable.id,objectIds));

    if (deleteResult.rowCount === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "Messages not found." }),
        { status: 404 }
      );
    }

    // Step 2: Update message count in users table
    const updateResult = await db
      .update(usersTable)
      .set({
        messageCount: sql`${usersTable.messageCount} - ${objectIds.length}`,
      })
      .where(eq(usersTable.id, userId));

    if (!updateResult.rowCount) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Failed to update user message count.",
        }),
        { status: 500 }
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
