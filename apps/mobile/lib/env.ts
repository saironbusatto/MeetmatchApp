import Constants from "expo-constants";

type Extra = {
  apiUrl?: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  featureMaps?: boolean;
};

const extra = (Constants.expoConfig?.extra ?? {}) as Extra;

function pickExtra(value: string | undefined): string | undefined {
  if (!value) return undefined;
  if (value.startsWith("${")) return undefined; // não interpolado
  return value;
}

function readEnv(name: string): string | undefined {
  const value = process.env[name];
  return value && value.length > 0 ? value : undefined;
}

function required(name: string, devFallback?: string): string {
  const extraValue = pickExtra(
    name === "EXPO_PUBLIC_API_URL"
      ? extra.apiUrl
      : name === "EXPO_PUBLIC_SUPABASE_URL"
        ? extra.supabaseUrl
        : name === "EXPO_PUBLIC_SUPABASE_ANON_KEY"
          ? extra.supabaseAnonKey
          : undefined
  );

  const value = extraValue ?? readEnv(name);
  if (value) return value;

  if (__DEV__ && devFallback) return devFallback;

  throw new Error(`Missing required env var: ${name} (set EXPO_PUBLIC_${name.replace(/^EXPO_PUBLIC_/, "")} or app.json extra)`);
}

export const env = {
  apiUrl: required("EXPO_PUBLIC_API_URL", "http://localhost:3001/api/v1"),
  supabaseUrl: required("EXPO_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: required("EXPO_PUBLIC_SUPABASE_ANON_KEY"),
  featureMaps: extra.featureMaps ?? false
} as const;
