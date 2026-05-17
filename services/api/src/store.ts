import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { getDb } from "./db/client";
import { userDevices as userDevicesTable } from "./db/schema";

export type EventType = "PRIVATE" | "PUBLIC";
export type EventStatus = "DRAFT" | "OPEN" | "CONFIRMED" | "CANCELLED";
export type ParticipantRole = "OWNER" | "INVITEE" | "KEY_PERSON";
export type InviteStatus = "PENDING" | "ACCEPTED" | "DECLINED";
export type AvailabilityResponse = "YES" | "MAYBE" | "NO";
export type RegistrationStatus = "REGISTERED" | "CANCELLED";

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EventRecord {
  id: string;
  ownerId: string;
  type: EventType;
  title: string;
  description: string | null;
  locationText: string | null;
  status: EventStatus;
  confirmedDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PrivateEventSettingsRecord {
  eventId: string;
  dateWindowStart: string;
  dateWindowEnd: string;
  keyPersonUserId: string | null;
  keyPersonWeight: number;
}

export interface EventParticipantRecord {
  id: string;
  eventId: string;
  userId: string | null;
  email: string | null;
  nameSnapshot: string | null;
  role: ParticipantRole;
  inviteStatus: InviteStatus;
  inviteToken: string;
}

export interface AvailabilityRecord {
  id: string;
  eventId: string;
  participantId: string;
  date: string;
  response: AvailabilityResponse;
}

export interface PublicEventSettingsRecord {
  eventId: string;
  eventDate: string;
  eventTime: string | null;
  capacity: number;
  category: string | null;
}

export interface PublicRegistrationRecord {
  id: string;
  eventId: string;
  userId: string;
  status: RegistrationStatus;
  createdAt: string;
}

export interface UserDeviceRecord {
  id: string;
  userId: string;
  platform: "ios" | "android" | "web";
  token: string;
  pushEnabled: boolean;
  quietHoursStart: string | null;
  quietHoursEnd: string | null;
  createdAt: string;
  updatedAt: string;
}

const users = new Map<string, UserRecord>();
const usersByEmail = new Map<string, string>();

const events = new Map<string, EventRecord>();
const privateSettings = new Map<string, PrivateEventSettingsRecord>();
const participants = new Map<string, EventParticipantRecord>();
const participantsByInviteToken = new Map<string, string>();
const availability = new Map<string, AvailabilityRecord>();

const publicSettings = new Map<string, PublicEventSettingsRecord>();
const registrations = new Map<string, PublicRegistrationRecord>();
const userDevices = new Map<string, UserDeviceRecord>();

export function nowIso() {
  return new Date().toISOString();
}

export function upsertUserFromAuth(input: { id: string; email: string; name?: string | null; avatarUrl?: string | null }) {
  const existing = users.get(input.id);
  if (existing) {
    const updated: UserRecord = {
      ...existing,
      email: input.email,
      name: input.name ?? existing.name,
      avatarUrl: input.avatarUrl ?? existing.avatarUrl,
      updatedAt: nowIso()
    };
    users.set(updated.id, updated);
    usersByEmail.set(updated.email.toLowerCase(), updated.id);
    return updated;
  }

  const created: UserRecord = {
    id: input.id,
    email: input.email,
    name: input.name ?? input.email,
    avatarUrl: input.avatarUrl ?? null,
    createdAt: nowIso(),
    updatedAt: nowIso()
  };

  users.set(created.id, created);
  usersByEmail.set(created.email.toLowerCase(), created.id);
  return created;
}

export function findUserById(id: string) {
  return users.get(id) ?? null;
}

export function updateUser(id: string, input: { name?: string; avatarUrl?: string | null }) {
  const existing = users.get(id);
  if (!existing) {
    return null;
  }

  const updated: UserRecord = {
    ...existing,
    name: input.name ?? existing.name,
    avatarUrl: input.avatarUrl ?? existing.avatarUrl,
    updatedAt: nowIso()
  };

  users.set(id, updated);
  usersByEmail.set(updated.email.toLowerCase(), updated.id);
  return updated;
}

export async function upsertUserDevice(
  userId: string,
  input: {
    token: string;
    platform: "ios" | "android" | "web";
    pushEnabled?: boolean;
    quietHoursStart?: string | null;
    quietHoursEnd?: string | null;
  }
) {
  const dbClient = getDb();
  if (dbClient) {
    const existingRows = await dbClient
      .select()
      .from(userDevicesTable)
      .where(and(eq(userDevicesTable.userId, userId), eq(userDevicesTable.token, input.token)))
      .limit(1);
    const existing = existingRows[0];

    if (existing) {
      const [updated] = await dbClient
        .update(userDevicesTable)
        .set({
          platform: input.platform,
          pushEnabled: input.pushEnabled ?? existing.pushEnabled,
          quietHoursStart: input.quietHoursStart ?? existing.quietHoursStart,
          quietHoursEnd: input.quietHoursEnd ?? existing.quietHoursEnd,
          updatedAt: new Date()
        })
        .where(eq(userDevicesTable.id, existing.id))
        .returning();

      if (!updated) {
        throw new Error("Failed to update user device");
      }

      return {
        id: updated.id,
        userId: updated.userId,
        platform: updated.platform,
        token: updated.token,
        pushEnabled: updated.pushEnabled,
        quietHoursStart: updated.quietHoursStart,
        quietHoursEnd: updated.quietHoursEnd,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString()
      } satisfies UserDeviceRecord;
    }

    const [created] = await dbClient
      .insert(userDevicesTable)
      .values({
        id: randomUUID(),
        userId,
        token: input.token,
        platform: input.platform,
        pushEnabled: input.pushEnabled ?? true,
        quietHoursStart: input.quietHoursStart ?? null,
        quietHoursEnd: input.quietHoursEnd ?? null,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();

    if (!created) {
      throw new Error("Failed to create user device");
    }

    return {
      id: created.id,
      userId: created.userId,
      platform: created.platform,
      token: created.token,
      pushEnabled: created.pushEnabled,
      quietHoursStart: created.quietHoursStart,
      quietHoursEnd: created.quietHoursEnd,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString()
    } satisfies UserDeviceRecord;
  }

  const existing = [...userDevices.values()].find((item) => item.userId === userId && item.token === input.token);

  if (existing) {
    const updated: UserDeviceRecord = {
      ...existing,
      platform: input.platform,
      pushEnabled: input.pushEnabled ?? existing.pushEnabled,
      quietHoursStart: input.quietHoursStart ?? existing.quietHoursStart,
      quietHoursEnd: input.quietHoursEnd ?? existing.quietHoursEnd,
      updatedAt: nowIso()
    };
    userDevices.set(existing.id, updated);
    return updated;
  }

  const created: UserDeviceRecord = {
    id: randomUUID(),
    userId,
    token: input.token,
    platform: input.platform,
    pushEnabled: input.pushEnabled ?? true,
    quietHoursStart: input.quietHoursStart ?? null,
    quietHoursEnd: input.quietHoursEnd ?? null,
    createdAt: nowIso(),
    updatedAt: nowIso()
  };

  userDevices.set(created.id, created);
  return created;
}

export const db = {
  users,
  usersByEmail,
  events,
  privateSettings,
  participants,
  participantsByInviteToken,
  availability,
  publicSettings,
  registrations,
  userDevices
};
