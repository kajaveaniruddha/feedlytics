import { NextResponse } from "next/server";
import { workflowsSchema } from "@/schemas/workFlowsSchema";
import { userWorkFlowsTable } from "@/db/models/workflows";
import { db } from "@/db/db";
import { getServerSideSession } from "@/config/getServerSideSession";
import { User } from "next-auth";
import { and, eq } from "drizzle-orm";

export async function GET(req: Request) {
  const user = (await getServerSideSession()) as User;

  try {
    const workflows = await db
      .select()
      .from(userWorkFlowsTable)
      .where(eq(userWorkFlowsTable.userId, parseInt(user.id ?? "0")));

    const workflowsByProvider = workflows.reduce((acc, wf) => {
      acc[wf.provider] = acc[wf.provider] || [];
      acc[wf.provider].push({
        groupName: wf.groupName,
        webhookUrl: wf.webhookUrl,
      });
      return acc;
    }, {} as Record<string, { groupName: string; webhookUrl: string }[]>);

    return NextResponse.json({ success: true, workflows: workflowsByProvider });
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
  const data = workflowsSchema.parse(json);
  const userId = parseInt(user.id ?? "0");

  try {
    const result = await db.insert(userWorkFlowsTable).values({
      userId,
      provider: data.provider,
      groupName: data.groupName,
      webhookUrl: data.webhookUrl,
      notifyCategories: data.notifyCategories || [],
      isActive: data.isActive,
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
  const { id, provider, groupName, webhookUrl, notifyCategories, isActive } =
    json;
  if (!id) {
    return NextResponse.json(
      { success: false, error: "Missing workflow id" },
      { status: 400 }
    );
  }
  try {
    const result = await db
      .update(userWorkFlowsTable)
      .set({
        provider,
        groupName,
        webhookUrl,
        notifyCategories: notifyCategories || [],
        isActive,
      })
      .where(
        and(
          eq(userWorkFlowsTable.id, id),
          eq(userWorkFlowsTable.userId, parseInt(user.id ?? "0"))
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
      { success: false, error: "Missing workflow id" },
      { status: 400 }
    );
  }
  try {
    await db
      .delete(userWorkFlowsTable)
      .where(
        and(
          eq(userWorkFlowsTable.id, id),
          eq(userWorkFlowsTable.userId, parseInt(user.id ?? "0"))
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
