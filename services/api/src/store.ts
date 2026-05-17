import { randomUUID } from "node:crypto";

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
  password: string;
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

const users = new Map<string, UserRecord>();
const usersByEmail = new Map<string, string>();
const sessions = new Map<string, string>();

const events = new Map<string, EventRecord>();
const privateSettings = new Map<string, PrivateEventSettingsRecord>();
const participants = new Map<string, EventParticipantRecord>();
const participantsByInviteToken = new Map<string, string>();
const availability = new Map<string, AvailabilityRecord>();

const publicSettings = new Map<string, PublicEventSettingsRecord>();
const registrations = new Map<string, PublicRegistrationRecord>();

export function nowIso() {
  return new Date().toISOString();
}

export function createUser(input: { name: string; email: string; password: string }) {
  const email = input.email.toLowerCase().trim();
  if (usersByEmail.has(email)) {
    return null;
  }

  const user: UserRecord = {
    id: randomUUID(),
    name: input.name,
    email,
    password: input.password,
    avatarUrl: null,
    createdAt: nowIso(),
    updatedAt: nowIso()
  };

  users.set(user.id, user);
  usersByEmail.set(user.email, user.id);
  return user;
}

export function findUserByEmail(email: string) {
  const userId = usersByEmail.get(email.toLowerCase().trim());
  return userId ? users.get(userId) ?? null : null;
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
  return updated;
}

export function createSession(userId: string) {
  const token = `dev_${randomUUID()}`;
  sessions.set(token, userId);
  return token;
}

export function getSessionUserId(token: string) {
  return sessions.get(token) ?? null;
}

export function revokeSession(token: string) {
  return sessions.delete(token);
}

export function createPrivateEvent(input: {
  ownerId: string;
  title: string;
  description?: string;
  locationText?: string;
  dateWindowStart: string;
  dateWindowEnd: string;
  keyPersonUserId?: string;
  keyPersonWeight?: number;
}) {
  const event: EventRecord = {
    id: randomUUID(),
    ownerId: input.ownerId,
    type: "PRIVATE",
    title: input.title,
    description: input.description ?? null,
    locationText: input.locationText ?? null,
    status: "DRAFT",
    confirmedDate: null,
    createdAt: nowIso(),
    updatedAt: nowIso()
  };

  const settings: PrivateEventSettingsRecord = {
    eventId: event.id,
    dateWindowStart: input.dateWindowStart,
    dateWindowEnd: input.dateWindowEnd,
    keyPersonUserId: input.keyPersonUserId ?? null,
    keyPersonWeight: input.keyPersonWeight ?? 3
  };

  const ownerParticipant: EventParticipantRecord = {
    id: randomUUID(),
    eventId: event.id,
    userId: input.ownerId,
    email: null,
    nameSnapshot: null,
    role: "OWNER",
    inviteStatus: "ACCEPTED",
    inviteToken: randomUUID()
  };

  events.set(event.id, event);
  privateSettings.set(event.id, settings);
  participants.set(ownerParticipant.id, ownerParticipant);
  participantsByInviteToken.set(ownerParticipant.inviteToken, ownerParticipant.id);

  return { event, settings };
}

export function createPublicEvent(input: {
  ownerId: string;
  title: string;
  description?: string;
  locationText?: string;
  eventDate: string;
  eventTime?: string;
  capacity: number;
  category?: string;
}) {
  const event: EventRecord = {
    id: randomUUID(),
    ownerId: input.ownerId,
    type: "PUBLIC",
    title: input.title,
    description: input.description ?? null,
    locationText: input.locationText ?? null,
    status: "OPEN",
    confirmedDate: input.eventDate,
    createdAt: nowIso(),
    updatedAt: nowIso()
  };

  const settings: PublicEventSettingsRecord = {
    eventId: event.id,
    eventDate: input.eventDate,
    eventTime: input.eventTime ?? null,
    capacity: input.capacity,
    category: input.category ?? null
  };

  events.set(event.id, event);
  publicSettings.set(event.id, settings);
  return { event, settings };
}

export const db = {
  users,
  sessions,
  events,
  privateSettings,
  participants,
  participantsByInviteToken,
  availability,
  publicSettings,
  registrations
};
