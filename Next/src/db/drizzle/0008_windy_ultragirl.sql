CREATE TABLE "workflows" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"provider" varchar(20) NOT NULL,
	"group_name" varchar(50) NOT NULL,
	"webhook_url" varchar(255) NOT NULL,
	"notify_categories" text[] DEFAULT ARRAY['complaint']::text[] NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DROP TABLE "user_googlechat_spaces" CASCADE;--> statement-breakpoint
DROP TABLE "user_slack_channels" CASCADE;--> statement-breakpoint
ALTER TABLE "workflows" ADD CONSTRAINT "workflows_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;