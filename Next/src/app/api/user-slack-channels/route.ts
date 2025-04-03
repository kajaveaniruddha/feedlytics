import { NextResponse } from "next/server";
import { userSlackChannelSchema } from "@/schemas/userSlackChannelSchema";
import { userSlackChannelsTable } from "@/db/models/user-slack-channels";
import { db } from "@/db/db";
import { getServerSideSession } from "@/config/getServerSideSession";
import { User } from "next-auth";
import { and, eq } from "drizzle-orm";

export async function GET(req: Request) {
  const user = (await getServerSideSession()) as User;

  try {
    const channels = await db
      .select()
      .from(userSlackChannelsTable)
      .where(eq(userSlackChannelsTable.userId, parseInt(user.id ?? "0")));

    const channelsArr = channels.map((ch) => ({
      id: ch.id,
      isActive: ch.isActive,
      channelName: ch.channelName,
      webhookUrl: ch.webhookUrl,
      notifyCategories: ch.notifyCategories,
    }));

    return NextResponse.json({ success: true, channels: channelsArr });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.toString() },
      { status: 400 }
    );
  }
}

export async function POST(req: Request) {
  const user = (await getServerSideSession()) as User;
  const json = await req.json();
  const data = userSlackChannelSchema.parse(json);
  const userId = parseInt(user.id ?? "0");

  try {
    const result = await db.insert(userSlackChannelsTable).values({
      userId,
      channelName: data.channelName,
      webhookUrl: data.webhookUrl,
      notifyCategories: data.notifyCategories || [],
      isActive:data.isActive
    });
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.toString() },
      { status: 400 }
    );
  }
}


export async function PATCH(req: Request) {
  const user = (await getServerSideSession()) as User;
  const json = await req.json();
  const { id, channelName, webhookUrl, notifyCategories, isActive } = json;
  if (!id) {
    return NextResponse.json(
      { success: false, error: "Missing channel id" },
      { status: 400 }
    );
  }
  try {
    const result = await db
      .update(userSlackChannelsTable)
      .set({
        channelName,
        webhookUrl,
        notifyCategories: notifyCategories || [],
        isActive
      })
      .where(
        and(
          eq(userSlackChannelsTable.id, id),
          eq(userSlackChannelsTable.userId, parseInt(user.id ?? "0"))
        )
      );
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.toString() },
      { status: 400 }
    );
  }
}

export async function DELETE(req: Request) {
  const user = (await getServerSideSession()) as User;
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json(
      { success: false, error: "Missing channel id" },
      { status: 400 }
    );
  }
  try {
    await db
      .delete(userSlackChannelsTable)
      .where(
        and(
          eq(userSlackChannelsTable.id, id),
          eq(userSlackChannelsTable.userId, parseInt(user.id ?? "0"))
        )
      );
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.toString() },
      { status: 400 }
    );
  }
}
