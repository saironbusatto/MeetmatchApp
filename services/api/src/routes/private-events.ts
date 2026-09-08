import { randomUUID } from "node:crypto";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { suggestSlot, TIME_SLOTS } from "@farmei/utils";
import { requireAuth } from "../middleware/auth";
import { db, nowIso, type TimeSlot } from "../store";

const createSchemaBase = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  locationText: z.string().optional(),
  dateWindowStart: z.string().date(),
  dateWindowEnd: z.string().date(),
  keyPersonUserId: z.string().uuid().optional(),
  quorumMin: z.number().int().min(1).optional()
});

const createSchema = createSchemaBase
  .refine((v) => v.dateWindowEnd >= v.dateWindowStart, {
    message: "dateWindowEnd must be greater than or equal to dateWindowStart"
  });

const updateSchema = createSchemaBase.partial();

const participantSchema = z.object({
  email: z.string().email().optional(),
  userId: z.string().uuid().optional(),
  indicatedBy: z.array(z.string().uuid()).optional()
}).refine((v) => v.email || v.userId, { message: "email or userId is required" });

const availabilitySchema = z.object({
  inviteToken: z.string().uuid().optional(),
  responses: z.array(z.object({
    date: z.string().date(),
    slot: z.enum(TIME_SLOTS),
    response: z.enum(["YES", "MAYBE", "NO"])
  })).min(1)
});

const CONFIRMATION_WINDOW_MS = 24 * 60 * 60 * 1000;

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

function suggestionResult(found: NonNullable<ReturnType<typeof getEventOr404>>) {
  const slotVotes = buildSlotVotes(found.event.id);
  const eventParticipants = [...db.participants.values()].filter((p) => p.eventId === found.event.id);
  const acceptedParticipants = eventParticipants.filter((p) => p.inviteStatus === "ACCEPTED");
  const keyParticipant = eventParticipants.find((p) => p.userId === found.settings.keyPersonUserId);
  const indications = eventParticipants
    .filter((p) => p.inviteStatus === "ACCEPTED" && p.indicatedBy && p.indicatedBy.length > 0)
    .map((p) => ({ participantId: p.id, invitedBy: p.indicatedBy! }));

  return suggestSlot({
    slots: slotVotes,
    participantCount: acceptedParticipants.length,
    quorumMin: found.settings.quorumMin,
    keyPersonId: keyParticipant?.id ?? null,
    indications
  });
}

function windowOpen(event: { status: string; confirmationWindowEndsAt: string | null }) {
  if (event.status !== "CONFIRMED") return false;
  if (!event.confirmationWindowEndsAt) return false;
  return Date.now() <= new Date(event.confirmationWindowEndsAt).getTime();
}

function startConfirmationWindow() {
  return new Date(Date.now() + CONFIRMATION_WINDOW_MS).toISOString();
}

function setAvailabilityResponse(
  eventId: string,
  participantId: string,
  date: string,
  slot: TimeSlot,
  response: "YES" | "MAYBE" | "NO"
) {
  const existing = [...db.availability.values()].find(
    (item) =>
      item.eventId === eventId &&
      item.participantId === participantId &&
      item.date === date &&
      item.slot === slot
  );

  if (existing) {
    db.availability.set(existing.id, { ...existing, response });
  } else {
    const row = {
      id: randomUUID(),
      eventId,
      participantId,
      date,
      slot,
      response
    };
    db.availability.set(row.id, row);
  }
}

/**
 * Reavalia o par confirmado dentro da janela de 1 dia (D17/D18).
 * - Se o par atual ainda tem quórum (e key pessoa YES) → mantém.
 * - Se o par atual perdeu quórum → re-match para o próximo melhor par com quórum
 *   e reabre a janela (+1 dia), ou NO_DATE se não houver candidato.
 */
function recomputeConfirmation(eventId: string) {
  const found = getEventOr404(eventId);
  if (!found) return null;
  const { event } = found;
  if (event.status !== "CONFIRMED" || !windowOpen(event)) return null;

  const confirmedDate = event.confirmedDate;
  const confirmedSlot = event.confirmedSlot;

  const result = suggestionResult(found);
  const currentPairEligible = result.ranked.some(
    (r) =>
      r.date === confirmedDate &&
      r.slot === confirmedSlot &&
      r.quorumMet &&
      r.keyPersonState === "YES"
  );

  if (currentPairEligible) {
    return { event, rematched: false, noDate: false, suggestion: result.suggestion };
  }

  const winner = result.suggestion;
  if (!winner) {
    const updated = {
      ...event,
      status: "NO_DATE" as const,
      confirmedDate: null,
      confirmedSlot: null,
      confirmationWindowEndsAt: null,
      updatedAt: nowIso()
    };
    db.events.set(eventId, updated);
    return { event: updated, rematched: false, noDate: true, suggestion: null };
  }

  const updated = {
    ...event,
    status: "CONFIRMED" as const,
    confirmedDate: winner.date,
    confirmedSlot: winner.slot,
    confirmationWindowEndsAt: startConfirmationWindow(),
    updatedAt: nowIso()
  };
  db.events.set(eventId, updated);
  return { event: updated, rematched: true, noDate: false, suggestion: winner };
}

function isParticipant(eventId: string, userId: string) {
  return [...db.participants.values()].some((p) => p.eventId === eventId && p.userId === userId);
}

function getOrCreateParticipantByToken(token: string) {
  const participantId = db.participantsByInviteToken.get(token);
  if (!participantId) return null;
  return db.participants.get(participantId) ?? null;
}

function buildSlotVotes(eventId: string) {
  const rows = [...db.availability.values()].filter((item) => item.eventId === eventId);
  const completed = rows.filter((r) => {
    const participant = db.participants.get(r.participantId);
    return participant?.inviteStatus === "ACCEPTED";
  });

  const byPair = new Map<string, Array<{ participantId: string; choice: "YES" | "MAYBE" | "NO" }>>();
  for (const row of completed) {
    const key = `${row.date}|${row.slot}`;
    const bucket = byPair.get(key) ?? [];
    bucket.push({ participantId: row.participantId, choice: row.response });
    byPair.set(key, bucket);
  }

  return [...byPair.entries()].map(([key, responses]) => {
    const [date, slot] = key.split("|");
    return { date: date!, slot: slot as TimeSlot, responses };
  });
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
      confirmedSlot: null,
      confirmationWindowEndsAt: null,
      createdAt: nowIso(),
      updatedAt: nowIso()
    };

    db.events.set(eventId, event);
    db.privateSettings.set(eventId, {
      eventId,
      dateWindowStart: payload.dateWindowStart,
      dateWindowEnd: payload.dateWindowEnd,
      keyPersonUserId: payload.keyPersonUserId ?? null,
      quorumMin: payload.quorumMin ?? 1
    });

    const ownerParticipant = {
      id: randomUUID(),
      eventId,
      userId: auth.userId,
      email: null,
      nameSnapshot: null,
      role: "OWNER" as const,
      inviteStatus: "ACCEPTED" as const,
      inviteToken: randomUUID(),
      indicatedBy: null
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
      keyPersonUserId: payload.keyPersonUserId ?? found.settings.keyPersonUserId,
      quorumMin: payload.quorumMin ?? found.settings.quorumMin
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
      inviteToken: randomUUID(),
      indicatedBy: payload.indicatedBy ?? null
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
        (item) =>
          item.eventId === eventId &&
          item.participantId === participant.id &&
          item.date === answer.date &&
          item.slot === answer.slot
      );

      if (existing) {
        db.availability.set(existing.id, { ...existing, response: answer.response });
      } else {
        const row = {
          id: randomUUID(),
          eventId,
          participantId: participant.id,
          date: answer.date,
          slot: answer.slot,
          response: answer.response
        };
        db.availability.set(row.id, row);
      }
    }

    const outcome = found.event.status === "CONFIRMED" && windowOpen(found.event)
      ? recomputeConfirmation(eventId)
      : null;

    if (outcome) {
      return c.json({ ok: true, ...outcome }, 200);
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

    const slotVotes = buildSlotVotes(eventId);
    if (slotVotes.length === 0) {
      return c.json({ message: "No availability responses found" }, 409);
    }

    const eventParticipants = [...db.participants.values()].filter((p) => p.eventId === eventId);
    const acceptedParticipants = eventParticipants.filter((p) => p.inviteStatus === "ACCEPTED");
    const keyParticipant = eventParticipants.find((p) => p.userId === found.settings.keyPersonUserId);
    const indications = eventParticipants
      .filter((p) => p.inviteStatus === "ACCEPTED" && p.indicatedBy && p.indicatedBy.length > 0)
      .map((p) => ({ participantId: p.id, invitedBy: p.indicatedBy! }));

    const result = suggestSlot({
      slots: slotVotes,
      participantCount: acceptedParticipants.length,
      quorumMin: found.settings.quorumMin,
      keyPersonId: keyParticipant?.id ?? null,
      indications
    });

    if (result.keyPersonBlocking) {
      return c.json({
        message: "Key person has not answered YES to any slot",
        suggestion: null,
        ranked: result.ranked,
        keyPersonBlocking: true
      }, 200);
    }

    return c.json(result, 200);
  })
  .post("/:id/confirm", (c) => {
    const auth = c.get("auth");
    const eventId = c.req.param("id");
    const found = getEventOr404(eventId);
    if (!found) return c.json({ message: "Event not found" }, 404);
    if (found.event.ownerId !== auth.userId) return c.json({ message: "Forbidden" }, 403);
    if (found.event.status === "CONFIRMED") return c.json({ message: "Event already confirmed" }, 409);

    const slotVotes = buildSlotVotes(eventId);
    if (slotVotes.length === 0) return c.json({ message: "No availability responses found" }, 409);

    const result = suggestionResult(found);

    const winner = result.suggestion;
    if (!winner) {
      const updated = {
        ...found.event,
        status: "NO_DATE" as const,
        updatedAt: nowIso()
      };
      db.events.set(eventId, updated);
      return c.json({
        message: "No pair meets key person gate and quorum",
        event: updated,
        suggestion: null,
        ranked: result.ranked,
        keyPersonBlocking: result.keyPersonBlocking
      }, 200);
    }

    const updated = {
      ...found.event,
      status: "CONFIRMED" as const,
      confirmedDate: winner.date,
      confirmedSlot: winner.slot,
      confirmationWindowEndsAt: startConfirmationWindow(),
      updatedAt: nowIso()
    };

    db.events.set(eventId, updated);
    return c.json({ event: updated, suggestion: winner }, 200);
  })
  .post("/:id/dia-do-bolo", zValidator("json", z.object({ action: z.enum(["leave", "join"]) })), (c) => {
    const auth = c.get("auth");
    const eventId = c.req.param("id");
    const { action } = c.req.valid("json");
    const found = getEventOr404(eventId);
    if (!found) return c.json({ message: "Event not found" }, 404);
    if (found.event.status !== "CONFIRMED") return c.json({ message: "Event is not confirmed" }, 409);
    if (!windowOpen(found.event)) return c.json({ message: "Confirmation window is closed" }, 409);

    const confirmedDate = found.event.confirmedDate;
    const confirmedSlot = found.event.confirmedSlot;
    if (!confirmedDate || !confirmedSlot) return c.json({ message: "Event has no confirmed pair" }, 409);

    const participant = [...db.participants.values()].find(
      (p) => p.eventId === eventId && p.userId === auth.userId
    );
    if (!participant) return c.json({ message: "Not a participant of this event" }, 403);

    const response = action === "leave" ? "NO" : "YES";
    setAvailabilityResponse(eventId, participant.id, confirmedDate, confirmedSlot, response);

    const outcome = recomputeConfirmation(eventId);
    if (!outcome) {
      return c.json({ event: found.event, rematched: false, noDate: false }, 200);
    }

    return c.json(outcome, 200);
  });
