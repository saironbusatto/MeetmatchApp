import type { MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

function clientKey(c: Parameters<MiddlewareHandler>[0], scope: string): string {
  const fwd = c.req.header("x-forwarded-for");
  const ip = (fwd ? fwd.split(",")[0]?.trim() : undefined) ?? c.req.header("x-real-ip") ?? "unknown";
  return `${scope}:${ip}`;
}

export interface RateLimitOptions {
  scope: string;
  limit: number;
  windowMs: number;
  keyFn?: (c: Parameters<MiddlewareHandler>[0]) => string;
}

export function rateLimit(options: RateLimitOptions): MiddlewareHandler {
  return async (c, next) => {
    const key = options.keyFn ? options.keyFn(c) : clientKey(c, options.scope);
    const now = Date.now();
    const existing = buckets.get(key);

    if (!existing || existing.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + options.windowMs });
    } else {
      existing.count += 1;
      if (existing.count > options.limit) {
        const retryAfter = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
        c.header("Retry-After", String(retryAfter));
        throw new HTTPException(429, { message: "Too many requests" });
      }
    }

    await next();
  };
}

export function resetRateLimits() {
  buckets.clear();
}
