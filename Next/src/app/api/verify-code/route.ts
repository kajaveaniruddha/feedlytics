import { db } from "@/db/db";
import { usersTable } from "@/db/models/user";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, decodedUsername))
      .limit(1);

    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User not found.",
        }),
        { status: 400 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry!) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      await db
        .update(usersTable)
        .set({ isVerified: true })
        .where(eq(usersTable.username, decodedUsername));

      return new Response(
        JSON.stringify({
          success: true,
          message: "Account verified.",
        }),
        { status: 200 }
      );
    } else {
      const errorMessage = !isCodeNotExpired
        ? "Code has expired, please sign up again."
        : "Incorrect verification code.";

      return new Response(
        JSON.stringify({
          success: false,
          message: errorMessage,
        }),
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying user.", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error verifying the username.",
      }),
      { status: 500 }
    );
  }
}
