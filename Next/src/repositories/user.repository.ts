import { db } from "@/db/db";
import { usersTable, InsertUser, SelectUser } from "@/db/models/user";
import { eq, and, or, sql } from "drizzle-orm";

export const userRepository = {
  async findById(id: number) {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);
    return user as SelectUser | undefined;
  },

  async findByEmail(email: string) {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);
    return user as SelectUser | undefined;
  },

  async findByUsername(username: string) {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username))
      .limit(1);
    return user as SelectUser | undefined;
  },

  async findByEmailOrUsername(identifier: string) {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(
        or(eq(usersTable.email, identifier), eq(usersTable.username, identifier))
      )
      .limit(1);
    return user as SelectUser | undefined;
  },

  async findByStripeCustomerId(customerId: string) {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.stripeCustomerId, customerId))
      .limit(1);
    return user as SelectUser | undefined;
  },

  async findVerifiedByUsername(username: string) {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(
        and(eq(usersTable.username, username), eq(usersTable.isVerified, true))
      )
      .limit(1);
    return user as SelectUser | undefined;
  },

  async findAllVerified() {
    return db
      .select()
      .from(usersTable)
      .where(eq(usersTable.isVerified, true));
  },

  async create(data: InsertUser) {
    const [user] = await db.insert(usersTable).values(data).returning();
    return user;
  },

  async createIfNotExists(data: InsertUser) {
    await db.insert(usersTable).values(data).onConflictDoNothing();
  },

  async updateById(id: number, data: Partial<InsertUser>) {
    const result = await db
      .update(usersTable)
      .set(data)
      .where(eq(usersTable.id, id));
    return result.rowCount ?? 0;
  },

  async updateByEmail(email: string, data: Partial<InsertUser>) {
    const result = await db
      .update(usersTable)
      .set(data)
      .where(eq(usersTable.email, email));
    return result.rowCount ?? 0;
  },

  async updateByStripeCustomerId(customerId: string, data: Partial<InsertUser>) {
    const result = await db
      .update(usersTable)
      .set(data)
      .where(eq(usersTable.stripeCustomerId, customerId));
    return result.rowCount ?? 0;
  },

  async incrementMessageCount(id: number) {
    await db
      .update(usersTable)
      .set({ messageCount: sql`${usersTable.messageCount} + 1` })
      .where(eq(usersTable.id, id));
  },

  async decrementMessageCount(id: number, count = 1) {
    await db
      .update(usersTable)
      .set({ messageCount: sql`${usersTable.messageCount} - ${count}` })
      .where(eq(usersTable.id, id));
  },

  async getSelectFields(id: number, fields: Record<string, any>) {
    const [result] = await db
      .select(fields)
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);
    return result;
  },
};
