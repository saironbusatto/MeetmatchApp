export type TimeSlot = "MANHA" | "TARDE" | "NOITE" | "ALTAS_HORAS";

export const TIME_SLOTS: readonly TimeSlot[] = ["MANHA", "TARDE", "NOITE", "ALTAS_HORAS"];

export enum EventType {
  PRIVATE = "PRIVATE",
  PUBLIC = "PUBLIC"
}

export enum EventStatus {
  DRAFT = "DRAFT",
  OPEN = "OPEN",
  CONFIRMED = "CONFIRMED",
  NO_DATE = "NO_DATE",
  CANCELLED = "CANCELLED"
}

export enum ParticipantRole {
  OWNER = "OWNER",
  INVITEE = "INVITEE",
  KEY_PERSON = "KEY_PERSON",
  ROLE_ALEATORIO = "ROLE_ALEATORIO"
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
  CANCELLED = "CANCELLED",
  WAITLIST = "WAITLIST"
}

export type AdmissionMode = "FIRST_COME" | "CONFIAVEL";

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
  /** Turno (faixa) ou hora fixa (ex. "18:00") conforme o matchingMode do evento. */
  confirmedSlot?: string | null;
  confirmationWindowEndsAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Como o evento privado cruza as respostas: por faixa (dia × turno) ou por hora fixa (dia × hora). */
export type MatchingMode = "FAIXA" | "FIXO";

export interface PrivateEventSettings {
  eventId: string;
  dateWindowStart: string;
  dateWindowEnd: string;
  keyPersonUserId?: string | null;
  quorumMin: number;
  matchingMode?: MatchingMode;
  /** Horários candidatos quando matchingMode = FIXO (ex. ["18:00", "20:00"]). */
  fixedSlots?: string[] | null;
}

export interface PublicEventSettings {
  eventId: string;
  eventDate: string;
  eventSlot?: TimeSlot | null;
  capacity: number;
  category?: string | null;
  admissionMode?: AdmissionMode;
}

export interface EventParticipant {
  id: string;
  eventId: string;
  userId?: string | null;
  email?: string | null;
  nameSnapshot?: string | null;
  role: ParticipantRole;
  inviteStatus: InviteStatus;
  indicatedBy?: string[] | null;
}

export interface AvailabilityResponse {
  id: string;
  eventId: string;
  participantId: string;
  date: string;
  slot: string;
  response: AvailabilityChoice;
}

export interface PublicEventRegistration {
  id: string;
  eventId: string;
  userId: string;
  status: RegistrationStatus;
  position?: number | null;
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
  access_token: string;
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
  quorumMin?: number;
  matchingMode?: MatchingMode;
  fixedSlots?: string[];
}

export interface CreatePublicEventRequest {
  title: string;
  description?: string;
  locationText?: string;
  eventDate: string;
  eventSlot?: TimeSlot;
  capacity: number;
  category?: string;
  admissionMode?: AdmissionMode;
}

export interface ApiErrorResponse {
  message: string;
  code?: string;
  details?: unknown;
}

/** Par (dia × turno) sugerido — shape V2 (gate + quórum). Em modo fixo, slot é uma hora (ex. "18:00"). */
export interface SlotSuggestion {
  date: string;
  slot: string;
  score: number;
  confidence: number;
  yesCount: number;
  quorumMet: boolean;
  keyPersonState: "YES" | "MAYBE" | "NO" | "NO_RESPONSE";
  reasoning: string;
}

export interface SuggestionResponse {
  suggestion: SlotSuggestion | null;
  ranked: SlotSuggestion[];
  keyPersonBlocking: boolean;
  message?: string;
}

export interface PrivateEventDetail {
  event: Event;
  settings: PrivateEventSettings;
  participants: EventParticipant[];
}

export interface AvailabilityRow {
  id: string;
  eventId: string;
  participantId: string;
  date: string;
  slot: string;
  response: AvailabilityChoice;
}

export interface AvailabilitySubmitRequest {
  inviteToken?: string;
  responses: Array<{
    date: string;
    slot: string;
    response: AvailabilityChoice;
  }>;
}

export interface DiaDoBoloResponse {
  event: Event;
  rematched: boolean;
  noDate: boolean;
  suggestion?: SlotSuggestion | null;
}

export interface PublicEventDetail {
  event: Event;
  settings: PublicEventSettings;
  attendees: PublicEventRegistration[];
}
