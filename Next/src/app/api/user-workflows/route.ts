import { NextResponse } from "next/server";
import { workflowsSchema } from "@/schemas/workFlowsSchema";
import { userWorkFlowsTable } from "@/db/models/workflows";
import { db } from "@/db/db";
import { getServerSideSession } from "@/config/getServerSideSession";
import { User } from "next-auth";
import { and, eq, sql } from "drizzle-orm";
import { usersTable } from "@/db/models/user";

function trimValues(obj: any): any {
  if (typeof obj === "string") return obj.trim();
  if (obj && typeof obj === "object") {
    for (const key in obj) {
      if (typeof obj[key] === "string") {
        obj[key] = obj[key].trim();
      } else if (Array.isArray(obj[key])) {
        obj[key] = obj[key].map((item: any) =>
          typeof item === "string" ? item.trim() : item
        );
      }
    }
  }
  return obj;
}

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
        id: wf.id.toString(),
        groupName: wf.groupName,
        webhookUrl: wf.webhookUrl,
        notifyCategories: wf.notifyCategories || [],
        isActive: wf.isActive || false,
      });
      return acc;
    }, {} as Record<string, { id: string; groupName: string; webhookUrl: string; notifyCategories: string[]; isActive: boolean }[]>);

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
  let json = await req.json();
  json = trimValues(json);
  const data = workflowsSchema.parse(json);
  const userId = parseInt(user.id ?? "0");

  try {
    // Get user's max_workflows limit and current workflow count
    const [userData, currentWorkflows] = await Promise.all([
      db
        .select({ maxWorkflows: usersTable.maxWorkflows })
        .from(usersTable)
        .where(eq(usersTable.id, userId))
        .limit(1),
      db
        .select({ count: sql<number>`count(*)` })
        .from(userWorkFlowsTable)
        .where(eq(userWorkFlowsTable.userId, userId)),
    ]);

    if (!userData[0]) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const maxWorkflows = userData[0].maxWorkflows ?? 5;
    const currentCount = Number(currentWorkflows[0].count);

    if (currentCount >= maxWorkflows) {
      return NextResponse.json(
        {
          success: false,
          message: `You have reached your maximum workflow limit of ${maxWorkflows}. Please upgrade your plan to add more workflows.`,
        },
        { status: 403 }
      );
    }

    const result = await db.insert(userWorkFlowsTable).values({
      userId,
      provider: data.provider,
      groupName: data.groupName,
      webhookUrl: data.webhookUrl,
      notifyCategories: data.notifyCategories || [],
      isActive: data.isActive,
    });
    return NextResponse.json({
      success: true,
      data: result,
      message: "Workflow created successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.toString() },
      { status: 400 }
    );
  }
}

export async function PATCH(req: Request) {
  const user = (await getServerSideSession()) as User;
  let json = await req.json();
  json = trimValues(json);
  const { id, provider, groupName, webhookUrl, notifyCategories, isActive } =
    json;
  if (id === undefined || id === null) {
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
  const json = await req.json();
  const { id } = json;
  if (id === undefined || id === null) {
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
