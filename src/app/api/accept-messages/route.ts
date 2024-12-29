import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { usersTable } from "@/db/models/user";
import { db } from "@/db/db";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!session || !session.user) {
    return new Response(
      JSON.stringify({ success: false, message: "Not Authenticated." }),
      { status: 401 }
    );
  }
  if (!session.user.id) {
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
      .where(eq(usersTable.id, parseInt(user?.id ?? "0")));

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
        message: "Failed to update user message acceptance status.",
      }),
      { status: 500 }
    );
  }
}
