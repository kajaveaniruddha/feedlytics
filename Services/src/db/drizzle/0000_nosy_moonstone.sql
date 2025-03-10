CREATE TABLE "feedbacks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"content" text NOT NULL,
	"stars" integer DEFAULT 5 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"sentiment" varchar(8) NOT NULL,
	"category" text[] DEFAULT ARRAY[]::text[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) DEFAULT 'user',
	"username" varchar(50) NOT NULL,
	"email" varchar(100) NOT NULL,
	"password" varchar(255) NOT NULL,
	"verify_code" varchar(100) NOT NULL,
	"verify_code_expiry" timestamp NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"is_accepting_message" boolean DEFAULT false NOT NULL,
	"introduction" text DEFAULT 'I hope you''re doing well. I''m reaching out to ask if you could kindly provide a short feedback about the product. Your feedback would be greatly appreciated.',
	"questions" text[] DEFAULT ARRAY['How much would you rate the product?', 'What did you like/dislike about the product?']::text[],
	"message_count" integer DEFAULT 0,
	"max_messages" integer DEFAULT 50,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;