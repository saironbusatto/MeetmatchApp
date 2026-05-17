import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { createSession, createUser, findUserByEmail, findUserById, getSessionUserId, revokeSession } from "../store";

const signupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const authRouter = new Hono()
  .post("/signup", zValidator("json", signupSchema), (c) => {
    const payload = c.req.valid("json");
    const user = createUser(payload);

    if (!user) {
      return c.json({ message: "Email already registered" }, 409);
    }

    const accessToken = createSession(user.id);
    return c.json({
      access_token: accessToken,
      user: { ...user, password: undefined }
    }, 201);
  })
  .post("/login", zValidator("json", loginSchema), (c) => {
    const payload = c.req.valid("json");
    const user = findUserByEmail(payload.email);

    if (!user || user.password !== payload.password) {
      return c.json({ message: "Invalid credentials" }, 401);
    }

    const accessToken = createSession(user.id);
    return c.json({ access_token: accessToken, user: { ...user, password: undefined } }, 200);
  })
  .post("/logout", (c) => {
    const authorization = c.req.header("Authorization") ?? "";
    const token = authorization.replace("Bearer ", "").trim();

    if (!token) {
      return c.json({ message: "Missing token" }, 400);
    }

    revokeSession(token);
    return c.json({ ok: true }, 200);
  })
  .get("/me", (c) => {
    const authorization = c.req.header("Authorization") ?? "";
    const token = authorization.replace("Bearer ", "").trim();
    const userId = getSessionUserId(token);

    if (!userId) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    const user = findUserById(userId);
    if (!user) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    return c.json({ user: { ...user, password: undefined } }, 200);
  });
