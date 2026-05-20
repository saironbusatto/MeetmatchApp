import type { MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { verifyAccessToken } from "../utils/jwt";

export const requireAuth: MiddlewareHandler<{ Variables: { auth: { userId: string } } }> = async (
  c,
  next
) => {
  const authorization = c.req.header("Authorization");

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new HTTPException(401, { message: "Missing or invalid Authorization header" });
  }

  const token = authorization.replace("Bearer ", "").trim();
  if (!token) {
    throw new HTTPException(401, { message: "JWT token not provided" });
  }

  try {
    const decoded = verifyAccessToken(token);
    c.set("auth", { userId: decoded.sub });
    await next();
  } catch {
    throw new HTTPException(401, { message: "Invalid JWT" });
  }
};
