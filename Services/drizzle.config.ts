import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./src/db/drizzle",
  schema: "./src/db/models",
  dialect: "postgresql",
  casing:"snake_case",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
