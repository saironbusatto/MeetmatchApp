import { randomUUID } from "node:crypto";
import type { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";

export async function errorHandler(c: Context, next: Next) {
  try {
    await next();
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json(
        {
          message: "Validation failed",
          details: error.flatten()
        },
        400
      );
    }

    if (error instanceof HTTPException) {
      return c.json({ message: error.message }, error.status);
    }

    const traceId = randomUUID();
    const detail = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    console.error(`[error ${traceId}]`, detail, error instanceof Error ? error.stack : undefined);

    return c.json({ message: "Internal server error", traceId }, 500);
  }
}
