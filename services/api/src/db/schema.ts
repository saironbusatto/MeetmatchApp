import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  date,
  numeric,
  integer,
  time,
  boolean,
  uniqueIndex
} from "drizzle-orm/pg-core";

export const eventTypeEnum = pgEnum("event_type", ["PRIVATE", "PUBLIC"]);
export const eventStatusEnum = pgEnum("event_status", ["DRAFT", "OPEN", "CONFIRMED", "CANCELLED"]);
export const participantRoleEnum = pgEnum("participant_role", ["OWNER", "INVITEE", "KEY_PERSON"]);
export const inviteStatusEnum = pgEnum("invite_status", ["PENDING", "ACCEPTED", "DECLINED"]);
export const availabilityResponseEnum = pgEnum("availability_response", ["YES", "MAYBE", "NO"]);
export const registrationStatusEnum = pgEnum("registration_status", ["REGISTERED", "CANCELLED"]);
export const devicePlatformEnum = pgEnum("device_platform", ["ios", "android", "web"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull()
});

export const userAuthCredentials = pgTable("user_auth_credentials", {
  userId: uuid("user_id").primaryKey(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull()
});

export const events = pgTable("events", {
  id: uuid("id").primaryKey(),
  ownerId: uuid("owner_id").notNull(),
  type: eventTypeEnum("type").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  locationText: text("location_text"),
  status: eventStatusEnum("status").notNull(),
  confirmedDate: date("confirmed_date"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull()
});

export const privateEventSettings = pgTable("private_event_settings", {
  eventId: uuid("event_id").primaryKey(),
  dateWindowStart: date("date_window_start").notNull(),
  dateWindowEnd: date("date_window_end").notNull(),
  keyPersonUserId: uuid("key_person_user_id"),
  keyPersonWeight: numeric("key_person_weight", { precision: 4, scale: 2 }).notNull()
});

export const eventParticipants = pgTable("event_participants", {
  id: uuid("id").primaryKey(),
  eventId: uuid("event_id").notNull(),
  userId: uuid("user_id"),
  email: text("email"),
  nameSnapshot: text("name_snapshot"),
  role: participantRoleEnum("role").notNull(),
  inviteStatus: inviteStatusEnum("invite_status").notNull(),
  inviteToken: uuid("invite_token").notNull().unique()
});

export const availabilityResponses = pgTable("availability_responses", {
  id: uuid("id").primaryKey(),
  eventId: uuid("event_id").notNull(),
  participantId: uuid("participant_id").notNull(),
  date: date("date").notNull(),
  response: availabilityResponseEnum("response").notNull()
});

export const publicEventSettings = pgTable("public_event_settings", {
  eventId: uuid("event_id").primaryKey(),
  eventDate: date("event_date").notNull(),
  eventTime: time("event_time"),
  capacity: integer("capacity").notNull(),
  category: text("category")
});

export const publicEventRegistrations = pgTable("public_event_registrations", {
  id: uuid("id").primaryKey(),
  eventId: uuid("event_id").notNull(),
  userId: uuid("user_id").notNull(),
  status: registrationStatusEnum("status").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull()
});

export const userDevices = pgTable(
  "user_devices",
  {
    id: uuid("id").primaryKey(),
    userId: uuid("user_id").notNull(),
    token: text("token").notNull(),
    platform: devicePlatformEnum("platform").notNull(),
    pushEnabled: boolean("push_enabled").notNull().default(true),
    quietHoursStart: time("quiet_hours_start"),
    quietHoursEnd: time("quiet_hours_end"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull()
  },
  (table) => ({
    tokenUnique: uniqueIndex("user_devices_token_unique").on(table.token),
    userTokenUnique: uniqueIndex("user_devices_user_token_unique").on(table.userId, table.token)
  })
);
