import Constants from "expo-constants";

type Extra = {
  apiUrl?: string;
  featureMaps?: boolean;
};

const extra = (Constants.expoConfig?.extra ?? {}) as Extra;

function pickExtra(value: string | undefined): string | undefined {
  if (!value) return undefined;
  if (value.startsWith("${")) return undefined;
  return value;
}

function readEnv(name: string): string | undefined {
  const value = process.env[name];
  return value && value.length > 0 ? value : undefined;
}

function required(name: string, devFallback?: string): string {
  const extraValue = pickExtra(
    name === "EXPO_PUBLIC_API_URL" ? extra.apiUrl : undefined
  );

  const value = extraValue ?? readEnv(name);
  if (value) return value;

  if (__DEV__ && devFallback) return devFallback;

  throw new Error(`Missing required env var: ${name}`);
}

export const env = {
  apiUrl: required("EXPO_PUBLIC_API_URL", "http://localhost:3001/api/v1"),
  featureMaps: extra.featureMaps ?? false
} as const;
