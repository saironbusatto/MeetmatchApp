import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import { env } from "./env";

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key)
};

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!client) {
    client = createClient(env.supabaseUrl, env.supabaseAnonKey, {
      auth: {
        storage: ExpoSecureStoreAdapter as unknown as Storage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
      }
    });
  }
  return client;
}

export async function getAccessToken(): Promise<string | null> {
  const { data } = await getSupabase().auth.getSession();
  return data.session?.access_token ?? null;
}

export const INVITE_TOKEN_KEY = "farmei.invite_token";
const INVITE_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 dias

type StoredInvite = { token: string; expiresAt: number };

function parseStored(raw: string | null): StoredInvite | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<StoredInvite>;
    if (typeof parsed.token === "string" && typeof parsed.expiresAt === "number") {
      return { token: parsed.token, expiresAt: parsed.expiresAt };
    }
  } catch {
    // formato antigo (string crua) — descartar
  }
  return null;
}

export async function rememberInviteToken(token: string, ttlMs: number = INVITE_TOKEN_TTL_MS) {
  const payload: StoredInvite = { token, expiresAt: Date.now() + ttlMs };
  await SecureStore.setItemAsync(INVITE_TOKEN_KEY, JSON.stringify(payload));
}

export async function readInviteToken(): Promise<string | null> {
  const raw = await SecureStore.getItemAsync(INVITE_TOKEN_KEY);
  const stored = parseStored(raw);
  if (!stored) {
    if (raw) await SecureStore.deleteItemAsync(INVITE_TOKEN_KEY).catch(() => undefined);
    return null;
  }
  if (stored.expiresAt <= Date.now()) {
    await SecureStore.deleteItemAsync(INVITE_TOKEN_KEY).catch(() => undefined);
    return null;
  }
  return stored.token;
}

export async function clearInviteToken() {
  await SecureStore.deleteItemAsync(INVITE_TOKEN_KEY);
}
