ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "verify_code" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "verify_code_expiry" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "max_workflows" integer DEFAULT 5;