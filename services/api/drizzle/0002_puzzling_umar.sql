CREATE TYPE "public"."admission_mode" AS ENUM('FIRST_COME', 'CONFIAVEL');--> statement-breakpoint
CREATE TYPE "public"."time_slot" AS ENUM('MANHA', 'TARDE', 'NOITE', 'ALTAS_HORAS');--> statement-breakpoint
ALTER TYPE "public"."event_status" ADD VALUE 'NO_DATE' BEFORE 'CANCELLED';--> statement-breakpoint
ALTER TYPE "public"."participant_role" ADD VALUE 'ROLE_ALEATORIO';--> statement-breakpoint
ALTER TYPE "public"."registration_status" ADD VALUE 'WAITLIST';--> statement-breakpoint
ALTER TABLE "availability_responses" ADD COLUMN "slot" time_slot NOT NULL;--> statement-breakpoint
ALTER TABLE "event_participants" ADD COLUMN "indicated_by" uuid[];--> statement-breakpoint
ALTER TABLE "event_participants" ADD COLUMN "invite_status_activated_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "confirmed_slot" time_slot;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "confirmation_window_ends_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "private_event_settings" ADD COLUMN "quorum_min" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "public_event_registrations" ADD COLUMN "position" integer;--> statement-breakpoint
ALTER TABLE "public_event_settings" ADD COLUMN "admission_mode" "admission_mode" DEFAULT 'FIRST_COME' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "availability_participant_date_slot_unique" ON "availability_responses" USING btree ("participant_id","date","slot");--> statement-breakpoint
CREATE UNIQUE INDEX "availability_event_date_slot_unique" ON "availability_responses" USING btree ("event_id","date","slot");--> statement-breakpoint
ALTER TABLE "private_event_settings" DROP COLUMN "key_person_weight";