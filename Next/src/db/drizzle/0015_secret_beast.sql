ALTER TABLE "users" ALTER COLUMN "max_messages" SET DEFAULT 200;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "max_workflows" SET DEFAULT 3;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "stripe_customer_id" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "stripe_subscription_id" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "billing_period_start" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "billing_period_end" timestamp;--> statement-breakpoint
CREATE INDEX "idx_feedbacks_user_created" ON "feedbacks" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_users_email" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_users_stripe_customer" ON "users" USING btree ("stripe_customer_id");--> statement-breakpoint
CREATE INDEX "idx_workflows_user" ON "workflows" USING btree ("user_id");