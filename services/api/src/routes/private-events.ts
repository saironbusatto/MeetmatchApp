import { randomUUID } from "node:crypto";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { suggestDate } from "@farmei/utils";
import { requireAuth } from "../middleware/auth";
import { db, nowIso } from "../store";

const createSchemaBase = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  locationText: z.string().optional(),
  dateWindowStart: z.string().date(),
  dateWindowEnd: z.string().date(),
  keyPersonUserId: z.string().uuid().optional()
});

const createSchema = createSchemaBase
  .refine((v) => v.dateWindowEnd >= v.dateWindowStart, {
    message: "dateWindowEnd must be greater than or equal to dateWindowStart"
  });

const updateSchema = createSchemaBase.partial();

const participantSchema = z.object({
  email: z.string().email().optional(),
  userId: z.string().uuid().optional()
}).refine((v) => v.email || v.userId, { message: "email or userId is required" });

const availabilitySchema = z.object({
  inviteToken: z.string().uuid().optional(),
  responses: z.array(z.object({
    date: z.string().date(),
    response: z.enum(["YES", "MAYBE", "NO"])
  })).min(1)
});

function getEventOr404(eventId: string) {
  const event = db.events.get(eventId);
  if (!event || event.type !== "PRIVATE") {
    return null;
  }

  const settings = db.privateSettings.get(eventId);
  if (!settings) {
    return null;
  }

  return { event, settings };
}

function isParticipant(eventId: string, userId: string) {
  return [...db.participants.values()].some((p) => p.eventId === eventId && p.userId === userId);
}

function getOrCreateParticipantByToken(token: string) {
  const participantId = db.participantsByInviteToken.get(token);
  if (!participantId) return null;
  return db.participants.get(participantId) ?? null;
}

export const privateEventsRouter = new Hono<{ Variables: { auth: { userId: string } } }>()
  .use("*", requireAuth)
  .get("/", (c) => {
    const auth = c.get("auth");
    const events = [...db.events.values()].filter(
      (e) => e.type === "PRIVATE" && (e.ownerId === auth.userId || isParticipant(e.id, auth.userId))
    );
    const items = events.map((event) => ({
      event,
      settings: db.privateSettings.get(event.id),
      participants: [...db.participants.values()].filter((p) => p.eventId === event.id),
    }));
    return c.json({ data: items }, 200);
  })
  .post("/", zValidator("json", createSchema), (c) => {
    const auth = c.get("auth");
    const payload = c.req.valid("json");

    const eventId = randomUUID();
    const event = {
      id: eventId,
      ownerId: auth.userId,
      type: "PRIVATE" as const,
      title: payload.title,
      description: payload.description ?? null,
      locationText: payload.locationText ?? null,
      status: "DRAFT" as const,
      confirmedDate: null,
      createdAt: nowIso(),
      updatedAt: nowIso()
    };

    db.events.set(eventId, event);
    db.privateSettings.set(eventId, {
      eventId,
      dateWindowStart: payload.dateWindowStart,
      dateWindowEnd: payload.dateWindowEnd,
      keyPersonUserId: payload.keyPersonUserId ?? null,
      keyPersonWeight: 3
    });

    const ownerParticipant = {
      id: randomUUID(),
      eventId,
      userId: auth.userId,
      email: null,
      nameSnapshot: null,
      role: "OWNER" as const,
      inviteStatus: "ACCEPTED" as const,
      inviteToken: randomUUID()
    };
    db.participants.set(ownerParticipant.id, ownerParticipant);
    db.participantsByInviteToken.set(ownerParticipant.inviteToken, ownerParticipant.id);

    return c.json({ event }, 201);
  })
  .get("/:id", (c) => {
    const auth = c.get("auth");
    const found = getEventOr404(c.req.param("id"));
    if (!found) return c.json({ message: "Event not found" }, 404);

    if (!isParticipant(found.event.id, auth.userId) && found.event.ownerId !== auth.userId) {
      return c.json({ message: "Forbidden" }, 403);
    }

    const eventParticipants = [...db.participants.values()].filter((p) => p.eventId === found.event.id);
    return c.json({ event: found.event, settings: found.settings, participants: eventParticipants }, 200);
  })
  .put("/:id", zValidator("json", updateSchema), (c) => {
    const auth = c.get("auth");
    const payload = c.req.valid("json");
    const found = getEventOr404(c.req.param("id"));
    if (!found) return c.json({ message: "Event not found" }, 404);
    if (found.event.ownerId !== auth.userId) return c.json({ message: "Forbidden" }, 403);

    const nextEvent = {
      ...found.event,
      title: payload.title ?? found.event.title,
      description: payload.description ?? found.event.description,
      locationText: payload.locationText ?? found.event.locationText,
      updatedAt: nowIso()
    };

    const nextSettings = {
      ...found.settings,
      dateWindowStart: payload.dateWindowStart ?? found.settings.dateWindowStart,
      dateWindowEnd: payload.dateWindowEnd ?? found.settings.dateWindowEnd,
      keyPersonUserId: payload.keyPersonUserId ?? found.settings.keyPersonUserId
    };

    if (nextSettings.dateWindowEnd < nextSettings.dateWindowStart) {
      return c.json({ message: "dateWindowEnd must be greater than or equal to dateWindowStart" }, 400);
    }

    db.events.set(found.event.id, nextEvent);
    db.privateSettings.set(found.event.id, nextSettings);

    return c.json({ event: nextEvent, settings: nextSettings }, 200);
  })
  .delete("/:id", (c) => {
    const auth = c.get("auth");
    const found = getEventOr404(c.req.param("id"));
    if (!found) return c.json({ message: "Event not found" }, 404);
    if (found.event.ownerId !== auth.userId) return c.json({ message: "Forbidden" }, 403);

    const next = { ...found.event, status: "CANCELLED" as const, updatedAt: nowIso() };
    db.events.set(found.event.id, next);
    return c.json({ event: next }, 200);
  })
  .post("/:id/participants", zValidator("json", participantSchema), (c) => {
    const auth = c.get("auth");
    const eventId = c.req.param("id");
    const payload = c.req.valid("json");
    const found = getEventOr404(eventId);
    if (!found) return c.json({ message: "Event not found" }, 404);
    if (found.event.ownerId !== auth.userId) return c.json({ message: "Forbidden" }, 403);

    const participant = {
      id: randomUUID(),
      eventId,
      userId: payload.userId ?? null,
      email: payload.email ?? null,
      nameSnapshot: null,
      role: "INVITEE" as const,
      inviteStatus: "PENDING" as const,
      inviteToken: randomUUID()
    };

    db.participants.set(participant.id, participant);
    db.participantsByInviteToken.set(participant.inviteToken, participant.id);

    return c.json({ participant, inviteLink: `/invite/${participant.inviteToken}` }, 201);
  })
  .delete("/:id/participants/:pid", (c) => {
    const auth = c.get("auth");
    const eventId = c.req.param("id");
    const pid = c.req.param("pid");
    const found = getEventOr404(eventId);
    if (!found) return c.json({ message: "Event not found" }, 404);
    if (found.event.ownerId !== auth.userId) return c.json({ message: "Forbidden" }, 403);

    const participant = db.participants.get(pid);
    if (!participant || participant.eventId !== eventId) {
      return c.json({ message: "Participant not found" }, 404);
    }

    if (participant.role === "OWNER") {
      return c.json({ message: "Owner cannot be removed" }, 400);
    }

    db.participants.delete(pid);
    db.participantsByInviteToken.delete(participant.inviteToken);
    return c.json({ ok: true }, 200);
  })
  .post("/:id/availability", zValidator("json", availabilitySchema), (c) => {
    const auth = c.get("auth");
    const eventId = c.req.param("id");
    const payload = c.req.valid("json");
    const found = getEventOr404(eventId);
    if (!found) return c.json({ message: "Event not found" }, 404);

    let participant = [...db.participants.values()].find((p) => p.eventId === eventId && p.userId === auth.userId) ?? null;

    if (!participant && payload.inviteToken) {
      const tokenParticipant = getOrCreateParticipantByToken(payload.inviteToken);
      if (tokenParticipant && tokenParticipant.eventId === eventId) {
        participant = tokenParticipant;
      }
    }

    if (!participant) {
      return c.json({ message: "Participant not found for this event" }, 403);
    }

    for (const answer of payload.responses) {
      const existing = [...db.availability.values()].find(
        (item) => item.eventId === eventId && item.participantId === participant.id && item.date === answer.date
      );

      if (existing) {
        db.availability.set(existing.id, { ...existing, response: answer.response });
      } else {
        const row = {
          id: randomUUID(),
          eventId,
          participantId: participant.id,
          date: answer.date,
          response: answer.response
        };
        db.availability.set(row.id, row);
      }
    }

    return c.json({ ok: true }, 200);
  })
  .get("/:id/availability", (c) => {
    const auth = c.get("auth");
    const eventId = c.req.param("id");
    const found = getEventOr404(eventId);
    if (!found) return c.json({ message: "Event not found" }, 404);
    if (!isParticipant(eventId, auth.userId) && found.event.ownerId !== auth.userId) {
      return c.json({ message: "Forbidden" }, 403);
    }

    const rows = [...db.availability.values()].filter((item) => item.eventId === eventId);
    return c.json({ availability: rows }, 200);
  })
  .get("/:id/suggestion", (c) => {
    const auth = c.get("auth");
    const eventId = c.req.param("id");
    const found = getEventOr404(eventId);
    if (!found) return c.json({ message: "Event not found" }, 404);
    if (found.event.ownerId !== auth.userId) return c.json({ message: "Forbidden" }, 403);

    const eventParticipants = [...db.participants.values()].filter((p) => p.eventId === eventId);
    const rows = [...db.availability.values()].filter((item) => item.eventId === eventId);

    const byDate = new Map<string, Array<{ participantId: string; response: "YES" | "MAYBE" | "NO" }>>();
    for (const row of rows) {
      const bucket = byDate.get(row.date) ?? [];
      bucket.push({ participantId: row.participantId, response: row.response });
      byDate.set(row.date, bucket);
    }

    const dates = [...byDate.entries()].map(([date, responses]) => ({ date, responses }));
    if (dates.length === 0) {
      return c.json({ message: "No availability responses found" }, 409);
    }

    const keyParticipant = eventParticipants.find((p) => p.userId === found.settings.keyPersonUserId);
    const result = suggestDate({
      participantCount: eventParticipants.length,
      keyPersonId: keyParticipant?.id ?? null,
      keyPersonWeight: found.settings.keyPersonWeight,
      dates
    });

    return c.json(result, 200);
  })
  .post("/:id/confirm", (c) => {
    const auth = c.get("auth");
    const eventId = c.req.param("id");
    const found = getEventOr404(eventId);
    if (!found) return c.json({ message: "Event not found" }, 404);
    if (found.event.ownerId !== auth.userId) return c.json({ message: "Forbidden" }, 403);
    if (found.event.status === "CONFIRMED") return c.json({ message: "Event already confirmed" }, 409);

    const rows = [...db.availability.values()].filter((item) => item.eventId === eventId);
    const byDate = new Map<string, Array<{ participantId: string; response: "YES" | "MAYBE" | "NO" }>>();
    for (const row of rows) {
      const bucket = byDate.get(row.date) ?? [];
      bucket.push({ participantId: row.participantId, response: row.response });
      byDate.set(row.date, bucket);
    }

    const dates = [...byDate.entries()].map(([date, responses]) => ({ date, responses }));
    if (dates.length === 0) return c.json({ message: "No availability responses found" }, 409);

    const eventParticipants = [...db.participants.values()].filter((p) => p.eventId === eventId);
    const keyParticipant = eventParticipants.find((p) => p.userId === found.settings.keyPersonUserId);

    const suggestion = suggestDate({
      participantCount: eventParticipants.length,
      keyPersonId: keyParticipant?.id ?? null,
      keyPersonWeight: found.settings.keyPersonWeight,
      dates
    });

    const updated = {
      ...found.event,
      status: "CONFIRMED" as const,
      confirmedDate: suggestion.date,
      updatedAt: nowIso()
    };

    db.events.set(eventId, updated);
    return c.json({ event: updated, suggestion }, 200);
  });
