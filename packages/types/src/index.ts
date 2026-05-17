export enum EventType {
  PRIVATE = "PRIVATE",
  PUBLIC = "PUBLIC"
}

export enum EventStatus {
  DRAFT = "DRAFT",
  OPEN = "OPEN",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED"
}

export enum ParticipantRole {
  OWNER = "OWNER",
  INVITEE = "INVITEE",
  KEY_PERSON = "KEY_PERSON"
}

export enum InviteStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED"
}

export enum AvailabilityChoice {
  YES = "YES",
  MAYBE = "MAYBE",
  NO = "NO"
}

export enum RegistrationStatus {
  REGISTERED = "REGISTERED",
  CANCELLED = "CANCELLED"
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  ownerId: string;
  type: EventType;
  title: string;
  description?: string | null;
  locationText?: string | null;
  status: EventStatus;
  confirmedDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PrivateEventSettings {
  eventId: string;
  dateWindowStart: string;
  dateWindowEnd: string;
  keyPersonUserId?: string | null;
  keyPersonWeight: number;
}

export interface PublicEventSettings {
  eventId: string;
  eventDate: string;
  eventTime?: string | null;
  capacity: number;
}

export interface EventParticipant {
  id: string;
  eventId: string;
  userId?: string | null;
  email?: string | null;
  nameSnapshot?: string | null;
  role: ParticipantRole;
  inviteStatus: InviteStatus;
}

export interface AvailabilityResponse {
  id: string;
  eventId: string;
  participantId: string;
  date: string;
  response: AvailabilityChoice;
}

export interface PublicEventRegistration {
  id: string;
  eventId: string;
  userId: string;
  status: RegistrationStatus;
  createdAt: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface UpdateUserRequest {
  name?: string;
  avatarUrl?: string | null;
}

export interface CreatePrivateEventRequest {
  title: string;
  description?: string;
  locationText?: string;
  dateWindowStart: string;
  dateWindowEnd: string;
  keyPersonUserId?: string;
}

export interface CreatePublicEventRequest {
  title: string;
  description?: string;
  locationText?: string;
  eventDate: string;
  eventTime?: string;
  capacity: number;
}

export interface ApiErrorResponse {
  message: string;
  code?: string;
  details?: unknown;
}
