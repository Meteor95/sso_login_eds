CREATE TABLE "sso_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"username" varchar(100) NOT NULL,
	"password" varchar(100) NOT NULL,
	"role" integer NOT NULL,
	"registration_number" varchar(255) NOT NULL,
	"status" boolean NOT NULL,
	"max_allowed_login" integer NOT NULL,
	"token" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "sso_services" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(255),
	"callback_url" varchar(255) NOT NULL,
	"api_key" varchar(255) NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "sso_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"token" varchar(255) NOT NULL,
	"ip_address" varchar(50),
	"user_agent" varchar(255),
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "sso_services" ADD CONSTRAINT "sso_services_user_id_sso_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."sso_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sso_sessions" ADD CONSTRAINT "sso_sessions_user_id_sso_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."sso_users"("id") ON DELETE no action ON UPDATE no action;