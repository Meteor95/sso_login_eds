CREATE TABLE "sso_users_login" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"deviced_id" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
