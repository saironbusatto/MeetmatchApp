import { createClient } from "@supabase/supabase-js";

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
