import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { usersTable } from "@/db/models/user";
import { db } from "@/db/db";
import { eq } from "drizzle-orm";

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response(
      JSON.stringify({ success: false, message: "Not Authenticated." }),
      { status: 401 }
    );
  }

  const { introduction, questions } = await request.json();
  try {
    const updateResult = await db
      .update(usersTable)
      .set({ introduction, questions })
      .where(eq(usersTable.id, parseInt(session.user.id ?? "0")));

    if (!updateResult.rowCount) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Failed to update.",
        }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Details updated successfully.",
      }),
      { status: 200 }
    );
    
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Couldn't update user.",
        error,
      }),
      { status: 500 }
    );
  }
}
