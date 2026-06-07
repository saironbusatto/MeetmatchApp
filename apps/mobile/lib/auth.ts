import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { env } from "./env";

const ACCESS_TOKEN_KEY = "farmei.access_token";

// SecureStore não existe no browser — usa localStorage como fallback
const storage = {
  async get(key: string): Promise<string | null> {
    if (Platform.OS === "web") return localStorage.getItem(key);
    return SecureStore.getItemAsync(key);
  },
  async set(key: string, value: string): Promise<void> {
    if (Platform.OS === "web") { localStorage.setItem(key, value); return; }
    await SecureStore.setItemAsync(key, value);
  },
  async remove(key: string): Promise<void> {
    if (Platform.OS === "web") { localStorage.removeItem(key); return; }
    await SecureStore.deleteItemAsync(key);
  }
};

export async function getAccessToken(): Promise<string | null> {
  return storage.get(ACCESS_TOKEN_KEY);
}

async function saveAccessToken(token: string) {
  await storage.set(ACCESS_TOKEN_KEY, token);
}

async function removeAccessToken() {
  await storage.remove(ACCESS_TOKEN_KEY);
}

type AuthUser = { id: string; name: string; email: string };
type AuthResult = { access_token: string; user: AuthUser };

async function post<T>(path: string, body: unknown): Promise<{ data: T | null; error: string | null }> {
  try {
    const res = await fetch(`${env.apiUrl}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const json = await res.json();
    if (!res.ok) {
      return { data: null, error: (json as { message?: string }).message ?? "Erro desconhecido" };
    }
    return { data: json as T, error: null };
  } catch {
    return { data: null, error: "Sem conexão com o servidor" };
  }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await post<AuthResult>("/auth/login", { email, password });
  if (error || !data) return { user: null, error };
  await saveAccessToken(data.access_token);
  return { user: data.user, error: null };
}

export async function signUp(email: string, password: string, name: string) {
  const { data, error } = await post<AuthResult>("/auth/signup", { email, password, name });
  if (error || !data) return { user: null, error };
  await saveAccessToken(data.access_token);
  return { user: data.user, error: null };
}

export async function signOut() {
  await removeAccessToken();
}

export async function hydrateSession(): Promise<AuthUser | null> {
  const token = await getAccessToken();
  if (!token) return null;
  try {
    const res = await fetch(`${env.apiUrl}/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
      await removeAccessToken();
      return null;
    }
    const json = await res.json() as { user?: AuthUser } & AuthUser;
    return json.user ?? json;
  } catch {
    return null;
  }
}

export const INVITE_TOKEN_KEY = "farmei.invite_token";
const INVITE_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

type StoredInvite = { token: string; expiresAt: number };

function parseStored(raw: string | null): StoredInvite | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<StoredInvite>;
    if (typeof parsed.token === "string" && typeof parsed.expiresAt === "number") {
      return { token: parsed.token, expiresAt: parsed.expiresAt };
    }
  } catch {
    // formato antigo — descartar
  }
  return null;
}

export async function rememberInviteToken(token: string, ttlMs = INVITE_TOKEN_TTL_MS) {
  const payload: StoredInvite = { token, expiresAt: Date.now() + ttlMs };
  await storage.set(INVITE_TOKEN_KEY, JSON.stringify(payload));
}

export async function readInviteToken(): Promise<string | null> {
  const raw = await storage.get(INVITE_TOKEN_KEY);
  const stored = parseStored(raw);
  if (!stored) {
    if (raw) await storage.remove(INVITE_TOKEN_KEY).catch(() => undefined);
    return null;
  }
  if (stored.expiresAt <= Date.now()) {
    await storage.remove(INVITE_TOKEN_KEY).catch(() => undefined);
    return null;
  }
  return stored.token;
}

export async function clearInviteToken() {
  await storage.remove(INVITE_TOKEN_KEY);
}
