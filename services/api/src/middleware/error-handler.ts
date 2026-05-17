import type { Context, Next } from "hono";
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

    if (error instanceof Error) {
      return c.json({ message: error.message }, 500);
    }

    return c.json({ message: "Unknown error" }, 500);
  }
}
