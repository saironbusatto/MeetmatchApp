import { Hono } from "hono";
import { requireAuth } from "../middleware/auth";
import { rateLimit } from "../middleware/rate-limit";
import { db } from "../store";

const inviteAcceptLimit = rateLimit({
  scope: "invites:accept",
  limit: 10,
  windowMs: 60 * 1000,
  keyFn: (c) => `invites:accept:${c.req.param("token") ?? "anon"}`
});

export const invitesRouter = new Hono<{ Variables: { auth: { userId: string } } }>()
  .use("*", requireAuth)
  .post("/:token/accept", inviteAcceptLimit, async (c) => {
    const token = c.req.param("token");
    const auth = c.get("auth");
    const participantId = db.participantsByInviteToken.get(token);

    if (!participantId) {
      return c.json({ message: "Invite token not found" }, 404);
    }

    const participant = db.participants.get(participantId);
    if (!participant) {
      return c.json({ message: "Invite token not found" }, 404);
    }

    if (participant.userId && participant.userId !== auth.userId) {
      return c.json({ message: "Invite already linked to another user" }, 409);
    }

    const next = {
      ...participant,
      userId: auth.userId,
      inviteStatus: "ACCEPTED" as const
    };

    db.participants.set(next.id, next);
    return c.json({ participant: next, eventId: next.eventId, participantId: next.id }, 200);
  });
