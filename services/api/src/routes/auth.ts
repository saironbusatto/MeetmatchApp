import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { createSupabaseAdminClient, createSupabasePublicClient } from "../lib/supabase";
import { rateLimit } from "../middleware/rate-limit";
import { upsertUserFromAuth } from "../store";

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

export const authRouter = new Hono()
  .post("/signup", signupLimit, zValidator("json", signupSchema), async (c) => {
    const payload = c.req.valid("json");

    const admin = createSupabaseAdminClient();
    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email: payload.email,
      password: payload.password,
      email_confirm: true,
      user_metadata: { name: payload.name }
    });

    if (createError || !created.user) {
      const status = createError?.status === 422 ? 409 : 400;
      return c.json({ message: createError?.message ?? "Failed to create user" }, status);
    }

    const user = upsertUserFromAuth({
      id: created.user.id,
      email: created.user.email ?? payload.email,
      name: (created.user.user_metadata?.name as string | undefined) ?? payload.name
    });

    const pub = createSupabasePublicClient();
    const { data: sessionData, error: signInError } = await pub.auth.signInWithPassword({
      email: payload.email,
      password: payload.password
    });

    if (signInError || !sessionData.session) {
      return c.json({ message: signInError?.message ?? "User created but session failed" }, 201);
    }

    return c.json(
      {
        access_token: sessionData.session.access_token,
        user
      },
      201
    );
  })
  .post("/login", loginLimit, zValidator("json", loginSchema), async (c) => {
    const payload = c.req.valid("json");
    const pub = createSupabasePublicClient();

    const { data, error } = await pub.auth.signInWithPassword({
      email: payload.email,
      password: payload.password
    });

    if (error || !data.user || !data.session) {
      return c.json({ message: "Invalid credentials" }, 401);
    }

    const user = upsertUserFromAuth({
      id: data.user.id,
      email: data.user.email ?? payload.email,
      name: (data.user.user_metadata?.name as string | undefined) ?? data.user.email ?? payload.email
    });

    return c.json({ access_token: data.session.access_token, user }, 200);
  })
  .post("/logout", async (c) => {
    const authorization = c.req.header("Authorization") ?? "";
    const token = authorization.replace("Bearer ", "").trim();

    if (!token) {
      return c.json({ message: "Missing token" }, 400);
    }

    const admin = createSupabaseAdminClient();
    await admin.auth.admin.signOut(token).catch(() => undefined);
    return c.json({ ok: true }, 200);
  })
  .get("/me", async (c) => {
    const authorization = c.req.header("Authorization") ?? "";
    const token = authorization.replace("Bearer ", "").trim();

    if (!token) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    const admin = createSupabaseAdminClient();
    const { data, error } = await admin.auth.getUser(token);
    if (error || !data.user) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    const user = upsertUserFromAuth({
      id: data.user.id,
      email: data.user.email ?? "",
      name: (data.user.user_metadata?.name as string | undefined) ?? data.user.email ?? ""
    });

    return c.json({ user }, 200);
  });
