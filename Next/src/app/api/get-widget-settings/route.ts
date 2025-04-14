import { NextResponse } from "next/server";
import { db } from "@/db/db";
import { usersTable } from "@/db/models/user";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { username } = await request.json();
    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username));
    const user = users[0];
    console.log(user)
    const response = {
      bg_color: user?.bgColor || "#ffffff",
      text_color: user?.textColor || "#000000",
      collect_info: {
        name: user?.collectName ?? false,
        email: user?.collectEmail ?? true,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in get-widget-settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
