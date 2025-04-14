ALTER TABLE "feedbacks" ADD COLUMN "name" varchar(50) DEFAULT 'sender';--> statement-breakpoint
ALTER TABLE "feedbacks" ADD COLUMN "email" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "bg_color" varchar(7) DEFAULT '#00000';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "text_color" varchar(7) DEFAULT '#ffffff';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "collect_name" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "collect_email" boolean DEFAULT false NOT NULL;