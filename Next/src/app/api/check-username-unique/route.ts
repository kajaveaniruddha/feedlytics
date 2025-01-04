
import { usersTable } from "@/db/models/user";;
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { db } from "@/db/db";
import { and, eq } from "drizzle-orm";

const UsernameQuerySchema = z.object({ username: usernameValidation });

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = { username: searchParams.get("username") };

    const result = UsernameQuerySchema.safeParse(queryParam);
    if (!result.success) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid query parameter." }),
        { status: 400 }
      );
    }

    const { username } = result.data;
    const existingVerifiedUser = await db
      .select()
      .from(usersTable)
      .where(and(eq(usersTable.username, username), eq(usersTable.isVerified, true)))
      .limit(1);

    if (existingVerifiedUser.length) {
      return new Response(
        JSON.stringify({ success: false, message: "Username is already taken." }),
        { status: 200 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Username is unique" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking username", error);
    return new Response(
      JSON.stringify({ success: false, message: "Error checking username" }),
      { status: 500 }
    );
  }
}

