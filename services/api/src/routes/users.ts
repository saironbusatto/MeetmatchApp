import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";
import { findUserById, updateUser, upsertUserDevice } from "../store";

const updateMeSchema = z.object({
  name: z.string().min(1).optional(),
  avatarUrl: z.string().url().nullable().optional()
});

const upsertDeviceSchema = z.object({
  token: z.string().min(16),
  platform: z.enum(["ios", "android", "web"]),
  pushEnabled: z.boolean().optional(),
  quietHoursStart: z.string().regex(/^\d{2}:\d{2}$/).nullable().optional(),
  quietHoursEnd: z.string().regex(/^\d{2}:\d{2}$/).nullable().optional()
});

export const usersRouter = new Hono<{ Variables: { auth: { userId: string } } }>()
  .use("*", requireAuth)
  .get("/me", async (c) => {
    const auth = c.get("auth");
    const user = await findUserById(auth.userId);

    if (!user) {
      return c.json({ message: "User not found" }, 404);
    }

    return c.json({ user }, 200);
  })
  .put("/me", zValidator("json", updateMeSchema), async (c) => {
    const auth = c.get("auth");
    const payload = c.req.valid("json");
    const existing = await findUserById(auth.userId);

    if (!existing) {
      return c.json({ message: "User not found" }, 404);
    }

    const updated = await updateUser(auth.userId, payload);

    if (!updated) {
      return c.json({ message: "User not found" }, 404);
    }

    return c.json({ user: updated }, 200);
  })
  .post("/me/devices", zValidator("json", upsertDeviceSchema), async (c) => {
    const auth = c.get("auth");
    const payload = c.req.valid("json");
    const device = await upsertUserDevice(auth.userId, payload);
    return c.json({ device }, 201);
  });
