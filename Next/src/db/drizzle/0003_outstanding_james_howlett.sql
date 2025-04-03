CREATE TABLE "user_slack_channels" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"channel_name" varchar(50) NOT NULL,
	"webhook_url" varchar(255) NOT NULL,
	"notify_categories" text[] DEFAULT ARRAY['complaint']::text[] NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "user_slack_channels" ADD CONSTRAINT "user_slack_channels_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;