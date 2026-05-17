import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";
import { findUserById, updateUser } from "../store";

const updateMeSchema = z.object({
  name: z.string().min(1).optional(),
  avatarUrl: z.string().url().nullable().optional()
});

export const usersRouter = new Hono<{ Variables: { auth: { userId: string } } }>()
  .use("*", requireAuth)
  .get("/me", (c) => {
    const auth = c.get("auth");
    const user = findUserById(auth.userId);
    if (!user) {
      return c.json({ message: "User not found" }, 404);
    }

    return c.json({ user: { ...user, password: undefined } }, 200);
  })
  .put("/me", zValidator("json", updateMeSchema), (c) => {
    const auth = c.get("auth");
    const payload = c.req.valid("json");
    const updated = updateUser(auth.userId, payload);

    if (!updated) {
      return c.json({ message: "User not found" }, 404);
    }

    return c.json({ user: { ...updated, password: undefined } }, 200);
  });
