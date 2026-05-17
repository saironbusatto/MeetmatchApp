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

export async function rememberInviteToken(token: string) {
  await SecureStore.setItemAsync(INVITE_TOKEN_KEY, token);
}

export async function readInviteToken(): Promise<string | null> {
  return SecureStore.getItemAsync(INVITE_TOKEN_KEY);
}

export async function clearInviteToken() {
  await SecureStore.deleteItemAsync(INVITE_TOKEN_KEY);
}
