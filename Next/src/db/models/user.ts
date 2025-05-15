import {
  pgTable,
  serial,
  text,
  varchar,
  boolean,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Define the User table
export const usersTable = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 50 }).default("user"),
    avatarUrl: varchar("avatar_url").default("https://github.com/shadcn.png"),
    username: varchar("username", { length: 50 }).notNull().unique(),
    email: varchar("email", { length: 100 }).notNull().unique(),
    password: varchar("password", { length: 255 }),
    verifyCode: varchar("verify_code", { length: 100 }),
    verifyCodeExpiry: timestamp("verify_code_expiry"),
    isVerified: boolean("is_verified").notNull().default(false),
    isAcceptingMessage: boolean("is_accepting_message")
      .notNull()
      .default(false),
    introduction: text("introduction").default(
      "I hope you're doing well. I'm reaching out to ask if you could kindly provide a short feedback about the product. Your feedback would be greatly appreciated."
    ),
    questions: text("questions")
      .array()
      .default(
        sql`ARRAY['How much would you rate the product?', 'What did you like/dislike about the product?']::text[]`
      ),
    messageCount: integer("message_count").default(0),
    maxMessages: integer("max_messages").default(50),
    maxWorkflows: integer("max_workflows").default(5),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    bgColor: varchar("bg_color", { length: 7 }).default("#000000"),
    textColor: varchar("text_color", { length: 7 }).default("#ffffff"),
    collectName: boolean("collect_name").notNull().default(false),
    collectEmail: boolean("collect_email").notNull().default(false),
    userTier: varchar("user_tier", { length: 50 }).default("free"),
  },
  (table) => [
    {
      emailCheck: sql`CHECK (${table.email} ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$')`,
    },
  ]
);

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;
