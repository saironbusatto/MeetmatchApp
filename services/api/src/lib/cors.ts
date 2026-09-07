const DEFAULT_DEV_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:8081",
  "http://localhost:19006"
];

export function resolveCorsOrigins(): string[] {
  const raw = process.env.CORS_ORIGIN?.trim();

  if (!raw) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("CORS_ORIGIN must be set in production");
    }
    return DEFAULT_DEV_ORIGINS;
  }

  return raw
    .split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0 && origin !== "*");
}
