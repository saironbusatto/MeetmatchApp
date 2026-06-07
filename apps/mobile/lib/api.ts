import type {
  ApiErrorResponse,
  AuthResponse,
  CreatePrivateEventRequest,
  CreatePublicEventRequest,
  Event,
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
        const res = await request<{ user: User }>("GET", "/auth/me");
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
        request<{ data: Array<{ event: Event; settings: unknown; participants: unknown[] }> }>(
          "GET", "/private-events"
        ),
      create: (body: CreatePrivateEventRequest) =>
        request<{ event: Event }>("POST", "/private-events", body),
      get: (id: string) =>
        request<{ event: Event; settings: unknown; participants: unknown[] }>("GET", `/private-events/${id}`),
      invite: (id: string, body: { email: string }) =>
        request<{ participant: unknown; inviteLink: string }>(
          "POST", `/private-events/${id}/participants`, body
        ),
      submitAvailability: (id: string, body: { responses: Array<{ date: string; response: "YES" | "MAYBE" | "NO" }> }) =>
        request<{ ok: boolean }>("POST", `/private-events/${id}/availability`, body),
      suggestion: (id: string) =>
        request<{ date: string; confidence: number; reasoning: string }>(
          "GET", `/private-events/${id}/suggestion`
        ),
      confirm: (id: string, date: string) =>
        request<{ event: Event }>("POST", `/private-events/${id}/confirm`, { date }),
    },
    publicEvents: {
      list: (category?: string) => {
        const qs = category ? `?category=${encodeURIComponent(category)}` : "";
        return request<{ data: Array<{ event: Event; settings: unknown }> }>("GET", `/public-events${qs}`);
      },
      create: (body: CreatePublicEventRequest) =>
        request<{ event: Event }>("POST", "/public-events", body),
      get: (id: string) =>
        request<{ event: Event; settings: unknown; registrationCount: number }>("GET", `/public-events/${id}`),
      register: (id: string) =>
        request<void>("POST", `/public-events/${id}/registrations`),
      getRegistrations: (id: string) =>
        request<{ registrations: unknown[] }>("GET", `/public-events/${id}/registrations`),
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
