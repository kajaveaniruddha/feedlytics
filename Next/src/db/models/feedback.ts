import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
  text,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { usersTable } from "./user";

export const feedbacksTable = pgTable(
  "feedbacks",
  {
    id: serial("id").primaryKey(),
    userId: integer('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
    content: text("content").notNull(),
    stars: integer("stars").notNull().default(5),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    sentiment: varchar("sentiment", { length: 8 }).notNull(),
    category: text("category")
      .array()
      .notNull()
      .default(sql`ARRAY[]::text[]`),
  },
  (table) => [
    { starsCheck: sql`CHECK (${table.stars} >= 0 AND ${table.stars} <= 5)` },
  ]
);

export type InsertFeedback = typeof feedbacksTable.$inferInsert;
export type SelectFeedback = typeof feedbacksTable.$inferSelect;
