import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/db/db";
import { usersTable } from "@/db/models/user";
import { eq } from "drizzle-orm";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: "Not Authenticated." },
      { status: 401 }
    );
  }

  const userEmail = session.user.email;
  if (!userEmail) {
    return NextResponse.json(
      { success: false, message: "Email not found in session." },
      { status: 400 }
    );
  }

  try {
    const user = await db
      .select({
        name: usersTable.name,
        username: usersTable.username,
        avatar_url: usersTable.avatarUrl,
        introduction: usersTable.introduction,
        questions: usersTable.questions,
        textColor: usersTable.textColor,
        bgColor: usersTable.bgColor,
        collectName: usersTable.collectName,
        collectEmail: usersTable.collectEmail,
      })
      .from(usersTable)
      .where(eq(usersTable.email, userEmail))
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
