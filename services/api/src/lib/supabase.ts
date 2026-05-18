import { createClient } from "@supabase/supabase-js";
import WebSocket from "ws";

// Supabase JS instancia RealtimeClient mesmo quando só usamos Auth.
// Em Node < 22 não existe WebSocket nativo — polyfill com ws.
if (typeof globalThis.WebSocket === "undefined") {
  (globalThis as unknown as { WebSocket: typeof WebSocket }).WebSocket = WebSocket;
}

function readSupabaseUrl() {
  const url = process.env.SUPABASE_URL;
  if (!url) {
    throw new Error("SUPABASE_URL is required.");
  }
  return url;
}

export function createSupabaseAdminClient() {
  const url = readSupabaseUrl();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required.");
  }

  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export function createSupabasePublicClient() {
  const url = readSupabaseUrl();
  const key = process.env.SUPABASE_ANON_KEY;

  if (!key) {
    throw new Error("SUPABASE_ANON_KEY is required.");
  }

  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
