import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { getDb } from "../db/client";
import { userAuthCredentials, users } from "../db/schema";
import { rateLimit } from "../middleware/rate-limit";
import { db as memoryDb, nowIso } from "../store";
import { signAccessToken } from "../utils/jwt";

const signupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

const signupLimit = rateLimit({ scope: "auth:signup", limit: 5, windowMs: 60 * 60 * 1000 });
const loginLimit = rateLimit({ scope: "auth:login", limit: 10, windowMs: 60 * 1000 });

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export const authRouter = new Hono()
  .post("/signup", signupLimit, zValidator("json", signupSchema), async (c) => {
    const payload = c.req.valid("json");
    const email = normalizeEmail(payload.email);
    const hash = await bcrypt.hash(payload.password, 10);
    const dbClient = getDb();

    if (dbClient) {
      const existing = await dbClient.select().from(users).where(eq(users.email, email)).limit(1);
      if (existing[0]) {
        return c.json({ message: "Email already in use" }, 409);
      }

      const userId = randomUUID();
      const now = new Date();
      const [createdUser] = await dbClient
        .insert(users)
        .values({
          id: userId,
          email,
          name: payload.name,
          avatarUrl: null,
          createdAt: now,
          updatedAt: now
        })
        .returning();

      await dbClient.insert(userAuthCredentials).values({
        userId,
        passwordHash: hash,
        createdAt: now,
        updatedAt: now
      });

      if (!createdUser) {
        return c.json({ message: "Erro ao criar usuário" }, 500);
      }

      const accessToken = signAccessToken({ userId: userId, email });
      return c.json(
        {
          access_token: accessToken,
          user: {
            id: createdUser.id,
            name: createdUser.name,
            email: createdUser.email
          }
        },
        201
      );
    }

    const existingId = memoryDb.usersByEmail.get(email);
    if (existingId) {
      return c.json({ message: "Email already in use" }, 409);
    }

    const userId = randomUUID();
    const user = {
      id: userId,
      name: payload.name,
      email,
      avatarUrl: null,
      createdAt: nowIso(),
      updatedAt: nowIso()
    };
    memoryDb.users.set(userId, user);
    memoryDb.usersByEmail.set(email, userId);
    memoryDb.authCredentials.set(userId, {
      userId,
      passwordHash: hash,
      createdAt: nowIso(),
      updatedAt: nowIso()
    });

    const accessToken = signAccessToken({ userId, email });
    return c.json({ access_token: accessToken, user: { id: user.id, name: user.name, email: user.email } }, 201);
  })
  .post("/login", loginLimit, zValidator("json", loginSchema), async (c) => {
    const payload = c.req.valid("json");
    const email = normalizeEmail(payload.email);
    const dbClient = getDb();

    if (dbClient) {
      const found = await dbClient
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          passwordHash: userAuthCredentials.passwordHash
        })
        .from(users)
        .innerJoin(userAuthCredentials, eq(userAuthCredentials.userId, users.id))
        .where(eq(users.email, email))
        .limit(1);

      const row = found[0];
      if (!row) {
        return c.json({ message: "Invalid credentials" }, 401);
      }

      const ok = await bcrypt.compare(payload.password, row.passwordHash);
      if (!ok) {
        return c.json({ message: "Invalid credentials" }, 401);
      }

      const accessToken = signAccessToken({ userId: row.id, email: row.email });
      return c.json({ access_token: accessToken, user: { id: row.id, name: row.name, email: row.email } }, 200);
    }

    const userId = memoryDb.usersByEmail.get(email);
    if (!userId) {
      return c.json({ message: "Invalid credentials" }, 401);
    }
    const user = memoryDb.users.get(userId);
    const cred = memoryDb.authCredentials.get(userId);
    if (!user || !cred) {
      return c.json({ message: "Invalid credentials" }, 401);
    }

    const ok = await bcrypt.compare(payload.password, cred.passwordHash);
    if (!ok) {
      return c.json({ message: "Invalid credentials" }, 401);
    }

    const accessToken = signAccessToken({ userId: user.id, email: user.email });
    return c.json({ access_token: accessToken, user: { id: user.id, name: user.name, email: user.email } }, 200);
  })
  .post("/logout", async (c) => {
    return c.json({ ok: true }, 200);
  })
  .get("/me", async (c) => {
    const authorization = c.req.header("Authorization") ?? "";
    const token = authorization.replace("Bearer ", "").trim();
    if (!token) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    // /me is now served by /users/me. Keep endpoint for backwards compatibility.
    return c.json({ message: "Use /api/v1/users/me with the same token" }, 200);
  });
