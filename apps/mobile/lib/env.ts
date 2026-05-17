import Constants from "expo-constants";

type Extra = {
  apiUrl?: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  featureMaps?: boolean;
};

const extra = (Constants.expoConfig?.extra ?? {}) as Extra;

function readEnv(name: string, fallback?: string): string {
  const fromProcess = process.env[name];
  if (fromProcess && fromProcess.length > 0) return fromProcess;
  if (fallback) return fallback;
  throw new Error(`Missing required env var: ${name}`);
}

export const env = {
  apiUrl:
    extra.apiUrl && !extra.apiUrl.startsWith("${")
      ? extra.apiUrl
      : readEnv("EXPO_PUBLIC_API_URL", "http://localhost:3001/api/v1"),
  supabaseUrl:
    extra.supabaseUrl && !extra.supabaseUrl.startsWith("${")
      ? extra.supabaseUrl
      : readEnv("EXPO_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey:
    extra.supabaseAnonKey && !extra.supabaseAnonKey.startsWith("${")
      ? extra.supabaseAnonKey
      : readEnv("EXPO_PUBLIC_SUPABASE_ANON_KEY"),
  featureMaps: extra.featureMaps ?? false
} as const;
