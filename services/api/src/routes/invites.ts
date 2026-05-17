import { Hono } from "hono";
import { db } from "../store";

export const invitesRouter = new Hono().post("/:token/accept", async (c) => {
  const token = c.req.param("token");
  const participantId = db.participantsByInviteToken.get(token);

  if (!participantId) {
    return c.json({ message: "Invite token not found" }, 404);
  }

  const participant = db.participants.get(participantId);
  if (!participant) {
    return c.json({ message: "Invite token not found" }, 404);
  }

  const body = await c.req.json().catch(() => ({}));
  const userId = typeof body.userId === "string" ? body.userId : null;

  const next = {
    ...participant,
    userId: userId ?? participant.userId,
    inviteStatus: "ACCEPTED" as const
  };

  db.participants.set(next.id, next);
  return c.json({ participant: next }, 200);
});
