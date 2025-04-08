import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { usersTable } from "./user";

export const userWorkFlowsTable = pgTable("workflows", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  provider: varchar("provider", { length: 20 })
    .notNull()
    .$type<"googlechat" | "slack">(),
  groupName: varchar("group_name", { length: 50 }).notNull(),
  webhookUrl: varchar("webhook_url", { length: 255 }).notNull(),
  notifyCategories: text("notify_categories")
    .array()
    .notNull()
    .default(sql`ARRAY['complaint']::text[]`),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type InsertChatGroup = typeof userWorkFlowsTable.$inferInsert;
export type SelectChatGroup = typeof userWorkFlowsTable.$inferSelect;
