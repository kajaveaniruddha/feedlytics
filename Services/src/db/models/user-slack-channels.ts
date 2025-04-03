import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  timestamp,
  boolean
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { usersTable } from "./user";

export const userSlackChannelsTable = pgTable("user_slack_channels", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),

  channelName: varchar("channel_name", { length: 50 }).notNull(), // e.g., "#customer-support"
  webhookUrl: varchar("webhook_url", { length: 255 }).notNull(),

  notifyCategories: text("notify_categories")
    .array()
    .notNull()
    .default(sql`ARRAY['complaint']::text[]`),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export type InsertFeedback = typeof userSlackChannelsTable.$inferInsert;
export type SelectFeedback = typeof userSlackChannelsTable.$inferSelect;
