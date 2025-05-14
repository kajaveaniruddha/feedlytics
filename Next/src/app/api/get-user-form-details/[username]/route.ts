import { NextResponse } from "next/server";
import { db } from "@/db/db";
import { usersTable } from "@/db/models/user";
import { eq } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  try {
    const user = await db
      .select({
        name: usersTable.name,
        introduction: usersTable.introduction,
        questions: usersTable.questions,
        avatar_url: usersTable.avatarUrl,
        collectName: usersTable.collectName,
        collectEmail: usersTable.collectEmail
      })
      .from(usersTable)
      .where(eq(usersTable.username, username))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User Found.",
        userDetails: user[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Couldn't find user.", error },
      { status: 500 }
    );
  }
}
