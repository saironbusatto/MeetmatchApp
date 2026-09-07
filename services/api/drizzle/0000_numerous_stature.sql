CREATE TYPE "public"."availability_response" AS ENUM('YES', 'MAYBE', 'NO');--> statement-breakpoint
CREATE TYPE "public"."device_platform" AS ENUM('ios', 'android', 'web');--> statement-breakpoint
CREATE TYPE "public"."event_status" AS ENUM('DRAFT', 'OPEN', 'CONFIRMED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."event_type" AS ENUM('PRIVATE', 'PUBLIC');--> statement-breakpoint
CREATE TYPE "public"."invite_status" AS ENUM('PENDING', 'ACCEPTED', 'DECLINED');--> statement-breakpoint
CREATE TYPE "public"."participant_role" AS ENUM('OWNER', 'INVITEE', 'KEY_PERSON');--> statement-breakpoint
CREATE TYPE "public"."registration_status" AS ENUM('REGISTERED', 'CANCELLED');--> statement-breakpoint
CREATE TABLE "availability_responses" (
	"id" uuid PRIMARY KEY NOT NULL,
	"event_id" uuid NOT NULL,
	"participant_id" uuid NOT NULL,
	"date" date NOT NULL,
	"response" "availability_response" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_participants" (
	"id" uuid PRIMARY KEY NOT NULL,
	"event_id" uuid NOT NULL,
	"user_id" uuid,
	"email" text,
	"name_snapshot" text,
	"role" "participant_role" NOT NULL,
	"invite_status" "invite_status" NOT NULL,
	"invite_token" uuid NOT NULL,
	CONSTRAINT "event_participants_invite_token_unique" UNIQUE("invite_token")
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY NOT NULL,
	"owner_id" uuid NOT NULL,
	"type" "event_type" NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"location_text" text,
	"status" "event_status" NOT NULL,
	"confirmed_date" date,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "private_event_settings" (
	"event_id" uuid PRIMARY KEY NOT NULL,
	"date_window_start" date NOT NULL,
	"date_window_end" date NOT NULL,
	"key_person_user_id" uuid,
	"key_person_weight" numeric(4, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "public_event_registrations" (
	"id" uuid PRIMARY KEY NOT NULL,
	"event_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"status" "registration_status" NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "public_event_settings" (
	"event_id" uuid PRIMARY KEY NOT NULL,
	"event_date" date NOT NULL,
	"event_time" time,
	"capacity" integer NOT NULL,
	"category" text
);
--> statement-breakpoint
CREATE TABLE "user_devices" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"platform" "device_platform" NOT NULL,
	"push_enabled" boolean DEFAULT true NOT NULL,
	"quiet_hours_start" time,
	"quiet_hours_end" time,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"avatar_url" text,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "user_devices_token_unique" ON "user_devices" USING btree ("token");--> statement-breakpoint
CREATE UNIQUE INDEX "user_devices_user_token_unique" ON "user_devices" USING btree ("user_id","token");