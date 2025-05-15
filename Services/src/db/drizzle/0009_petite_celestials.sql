ALTER TABLE "feedbacks" ALTER COLUMN "name" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "bg_color" SET DEFAULT '#000000';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "user_tier" varchar(50) DEFAULT 'free';