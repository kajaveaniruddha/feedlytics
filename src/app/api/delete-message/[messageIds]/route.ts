import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { usersTable } from "@/db/models/user";
import mongoose from "mongoose";
import { db } from "@/db/db";
import { eq, sql } from "drizzle-orm";

export async function DELETE(
  request: Request,
  props: { params: Promise<{ messageIds: string }> }
) {
  const params = await props.params;
  const { messageIds } = params;

  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!session || !session.user) {
    return new Response(
      JSON.stringify({ success: false, message: "Not Authenticated." }),
      { status: 401 }
    );
  }

  try {
    const objectIds = messageIds.split(",").map((id) => parseInt(id, 10));
    const updateResult = await db
      .update(usersTable)
      .set({
        messageCount: sql`${usersTable.messageCount} - ${objectIds.length}`,
      })
      .where(eq(usersTable.id, parseInt(user?.id ?? "0", 10)));

    if (!updateResult.rowCount) {
      return new Response(
        JSON.stringify({ success: false, message: "Messages not found." }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Messages deleted." }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error deleting messages.",
        error,
      }),
      { status: 500 }
    );
  }
}
