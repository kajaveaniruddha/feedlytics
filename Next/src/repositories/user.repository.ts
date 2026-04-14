import { db } from "@/db/db";
import { usersTable, InsertUser, SelectUser } from "@/db/models/user";
import { eq, and, sql } from "drizzle-orm";

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

  async findByStripeCustomerId(customerId: string) {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.stripeCustomerId, customerId))
      .limit(1);
    return user as SelectUser | undefined;
  },

  async create(data: InsertUser) {
    const [user] = await db.insert(usersTable).values(data).returning();
    return user as SelectUser;
  },

  async updateById(id: number, data: Partial<InsertUser>) {
    return db.update(usersTable).set(data).where(eq(usersTable.id, id));
  },

  async updateByEmail(email: string, data: Partial<InsertUser>) {
    return db.update(usersTable).set(data).where(eq(usersTable.email, email));
  },

  async updateByStripeCustomerId(customerId: string, data: Partial<InsertUser>) {
    return db
      .update(usersTable)
      .set(data)
      .where(eq(usersTable.stripeCustomerId, customerId));
  },

  async incrementMessageCount(id: number) {
    return db
      .update(usersTable)
      .set({ messageCount: sql`${usersTable.messageCount} + 1` })
      .where(eq(usersTable.id, id));
  },

  async decrementMessageCount(id: number, count = 1) {
    return db
      .update(usersTable)
      .set({ messageCount: sql`${usersTable.messageCount} - ${count}` })
      .where(eq(usersTable.id, id));
  },

  async findVerifiedByUsername(username: string) {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(and(eq(usersTable.username, username), eq(usersTable.isVerified, true)))
      .limit(1);
    return user as SelectUser | undefined;
  },

  async findAllVerified() {
    return db
      .select()
      .from(usersTable)
      .where(eq(usersTable.isVerified, true));
  },

  async selectFieldsById<T extends Partial<Record<keyof SelectUser, any>>>(
    id: number,
    fields: T
  ) {
    const rows = await db
      .select(fields)
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1) as any[];
    return rows[0];
  },

  async selectFieldsByEmail<T extends Partial<Record<keyof SelectUser, any>>>(
    email: string,
    fields: T
  ) {
    const rows = await db
      .select(fields)
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1) as any[];
    return rows[0];
  },
};
