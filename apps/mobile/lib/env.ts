import Constants from "expo-constants";

type Extra = {
  apiUrl?: string;
  featureMaps?: boolean;
};

const extra = (Constants.expoConfig?.extra ?? {}) as Extra;

function trimTrailingSlash(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function readEnv(name: string): string | undefined {
  const value = process.env[name];
  return value && value.length > 0 ? value : undefined;
}

function required(name: string, devFallback?: string): string {
  const value = name === "EXPO_PUBLIC_API_URL"
    ? (extra.apiUrl ?? readEnv(name))
    : readEnv(name);

  if (value && !value.startsWith("${")) return trimTrailingSlash(value);
  if (__DEV__ && devFallback) return devFallback;
  throw new Error(`Missing required env var: ${name}`);
}

export const env = {
  apiUrl: required("EXPO_PUBLIC_API_URL", "http://localhost:3001/api/v1"),
  clerkPublishableKey: required("EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY"),
  featureMaps: extra.featureMaps ?? false,
} as const;
