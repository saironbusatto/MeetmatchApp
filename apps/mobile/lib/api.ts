import type {
  ApiErrorResponse,
  AuthResponse,
  AvailabilityChoice,
  AvailabilitySubmitRequest,
  CreatePrivateEventRequest,
  CreatePublicEventRequest,
  DiaDoBoloResponse,
  Event,
  PrivateEventDetail,
  PublicEventDetail,
  SlotSuggestion,
  SuggestionResponse,
  TimeSlot,
  User
} from "@farmei/types";
import { z } from "zod";
import { env } from "./env";

export class ApiError extends Error {
  status: number;
  payload?: ApiErrorResponse;
  constructor(message: string, status: number, payload?: ApiErrorResponse) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

type Method = "GET" | "POST" | "PUT" | "DELETE";

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  avatarUrl: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export interface ApiClientOptions {
  baseUrl?: string;
  getToken?: () => Promise<string | null>;
}

function joinUrl(base: string, path: string): string {
  if (path.startsWith("http")) return path;
  return `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

export function createApiClient(options: ApiClientOptions = {}) {
  const baseUrl = options.baseUrl ?? env.apiUrl;
  const getToken = options.getToken;

  async function request<TResponse>(
    method: Method,
    path: string,
    body?: unknown
  ): Promise<TResponse> {
    const token = getToken ? await getToken() : null;
    const headers: Record<string, string> = {
      Accept: "application/json"
    };
    if (body !== undefined) headers["Content-Type"] = "application/json";
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(joinUrl(baseUrl, path), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body)
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => undefined)) as
        | ApiErrorResponse
        | undefined;
      throw new ApiError(
        payload?.message ?? `HTTP ${response.status}`,
        response.status,
        payload
      );
    }

    if (response.status === 204) return undefined as TResponse;
    return (await response.json()) as TResponse;
  }

  return {
    request,
    auth: {
      me: async () => {
        const res = await request<{ user: User }>("GET", "/users/me");
        return userSchema.parse(res.user);
      },
      signup: (body: { name: string; email: string; password: string }) =>
        request<AuthResponse>("POST", "/auth/signup", body),
      login: (body: { email: string; password: string }) =>
        request<AuthResponse>("POST", "/auth/login", body),
      logout: () => request<void>("POST", "/auth/logout")
    },
    users: {
      registerDevice: (body: {
        token: string;
        platform: "ios" | "android" | "web";
        pushEnabled?: boolean;
        quietHoursStart?: string | null;
        quietHoursEnd?: string | null;
      }) => request<{ device: { id: string } }>("POST", "/users/me/devices", body)
    },
    privateEvents: {
      list: () =>
        request<{ data: PrivateEventDetail[] }>(
          "GET", "/private-events"
        ),
      create: (body: CreatePrivateEventRequest) =>
        request<{ event: Event }>("POST", "/private-events", body),
      get: (id: string) =>
        request<PrivateEventDetail>("GET", `/private-events/${id}`),
      update: (id: string, body: { keyPersonUserId?: string | null; quorumMin?: number }) =>
        request<{ event: Event; settings: unknown }>("PUT", `/private-events/${id}`, body),
      invite: (id: string, body: { email: string }) =>
        request<{ participant: unknown; inviteLink: string }>(
          "POST", `/private-events/${id}/participants`, body
        ),
      submitAvailability: (id: string, body: AvailabilitySubmitRequest) =>
        request<{ ok: boolean }>("POST", `/private-events/${id}/availability`, body),
      availability: (id: string) =>
        request<{ availability: Array<{ id: string; eventId: string; participantId: string; date: string; slot: TimeSlot; response: AvailabilityChoice }> }>(
          "GET", `/private-events/${id}/availability`
        ),
      suggestion: (id: string) =>
        request<SuggestionResponse>(
          "GET", `/private-events/${id}/suggestion`
        ),
      confirm: (id: string) =>
        request<{ event: Event; suggestion: SlotSuggestion | null }>("POST", `/private-events/${id}/confirm`),
      diaDoBolo: (id: string, action: "leave" | "join") =>
        request<DiaDoBoloResponse>("POST", `/private-events/${id}/dia-do-bolo`, { action }),
    },
    publicEvents: {
      list: (category?: string) => {
        const qs = category ? `?category=${encodeURIComponent(category)}` : "";
        return request<{ data: Array<{ event: Event; settings: unknown }> }>("GET", `/public-events${qs}`);
      },
      create: (body: CreatePublicEventRequest) =>
        request<{ event: Event }>("POST", "/public-events", body),
      get: (id: string) =>
        request<PublicEventDetail>("GET", `/public-events/${id}`),
      register: (id: string) =>
        request<{ registration: { id: string; status: "REGISTERED" | "WAITLIST"; position?: number | null } }>(
          "POST", `/public-events/${id}/registrations`
        ),
      unregister: (id: string) =>
        request<{ ok: boolean }>("DELETE", `/public-events/${id}/registrations/me`),
      getRegistrations: (id: string) =>
        request<{ registrations: Array<{ id: string; status: string; position?: number | null; userId?: string | null }> }>(
          "GET", `/public-events/${id}/registrations`
        ),
      getWaitlist: (id: string) =>
        request<{ waitlist: Array<{ id: string; position: number; userId: string }> }>(
          "GET", `/public-events/${id}/waitlist`
        ),
    },
    invites: {
      accept: (token: string) =>
        request<{ eventId: string; participantId: string }>(
          "POST",
          `/invites/${token}/accept`
        )
    }
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
