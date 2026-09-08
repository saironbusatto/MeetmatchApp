import { app } from "../app";
import { db } from "../store";
import { signAccessToken } from "../utils/jwt";
import { resetRateLimits } from "../middleware/rate-limit";

export function setTestEnv() {
  process.env.JWT_SECRET = "test-secret";
  process.env.NODE_ENV = "test";
}

export async function clearDb() {
  for (const map of Object.values(db)) {
    map.clear();
  }
  resetRateLimits();
}

export function tokenFor(userId: string) {
  return signAccessToken({ userId, email: `${userId}@test.dev` });
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  token?: string;
  body?: unknown;
  query?: Record<string, string>;
};

export async function api(path: string, options: RequestOptions = {}) {
  const { method = "GET", token, body, query } = options;
  const url = query ? `${path}?${new URLSearchParams(query).toString()}` : path;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const init: RequestInit = {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body)
  };

  const res = await app.request(url, init);
  const text = await res.text();
  let json: any = null;
  if (text.length > 0) {
    try {
      json = JSON.parse(text);
    } catch {
      json = text;
    }
  }
  return { status: res.status, body: json, text };
}