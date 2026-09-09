import { randomUUID } from "node:crypto";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";
import { db, nowIso } from "../store";
import { TIME_SLOTS } from "@farmei/utils";

const FORMULA_PREFIXES = new Set(["=", "+", "-", "@", "\t", "\r"]);

function csvEscape(value: unknown): string {
  const raw = value == null ? "" : String(value);
  const needsQuoting = /[",\n\r]/.test(raw);
  const firstChar = raw.charAt(0);
  const guarded = FORMULA_PREFIXES.has(firstChar) ? `'${raw}` : raw;
  if (needsQuoting || FORMULA_PREFIXES.has(firstChar)) {
    return `"${guarded.replace(/"/g, '""')}"`;
  }
  return guarded;
}

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  locationText: z.string().optional(),
  eventDate: z.string().date(),
  eventSlot: z.enum(TIME_SLOTS).optional(),
  capacity: z.number().int().positive(),
  category: z.string().optional(),
  admissionMode: z.enum(["FIRST_COME", "CONFIAVEL"]).optional()
});

const updateSchema = createSchema.partial();

export const publicEventsRouter = new Hono<{ Variables: { auth: { userId: string } } }>()
  .use("*", requireAuth)
  .post("/", zValidator("json", createSchema), (c) => {
    const auth = c.get("auth");
    const payload = c.req.valid("json");

    const eventId = randomUUID();
    const event = {
      id: eventId,
      ownerId: auth.userId,
      type: "PUBLIC" as const,
      title: payload.title,
      description: payload.description ?? null,
      locationText: payload.locationText ?? null,
      status: "OPEN" as const,
      confirmedDate: payload.eventDate,
      confirmedSlot: null,
      confirmationWindowEndsAt: null,
      createdAt: nowIso(),
      updatedAt: nowIso()
    };

    db.events.set(eventId, event);
    db.publicSettings.set(eventId, {
      eventId,
      eventDate: payload.eventDate,
      eventSlot: payload.eventSlot ?? null,
      capacity: payload.capacity,
      category: payload.category ?? null,
      admissionMode: payload.admissionMode ?? "FIRST_COME"
    });

    return c.json({ event }, 201);
  })
  .get("/", (c) => {
    const rawPage = Number(c.req.query("page") ?? 1);
    const rawPageSize = Number(c.req.query("pageSize") ?? 10);
    const page = Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1;
    const pageSize = Number.isFinite(rawPageSize) && rawPageSize >= 1
      ? Math.min(Math.floor(rawPageSize), 50)
      : 10;
    const category = c.req.query("category");

    const items = [...db.events.values()].filter((e) => e.type === "PUBLIC" && e.status !== "CANCELLED");
    const filtered = category
      ? items.filter((item) => (db.publicSettings.get(item.id)?.category ?? "") === category)
      : items;

    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize).map((event) => ({
      event,
      settings: db.publicSettings.get(event.id)
    }));

    return c.json({ data, page, pageSize, total: filtered.length }, 200);
  })
  .get("/:id", (c) => {
    const event = db.events.get(c.req.param("id"));
    if (!event || event.type !== "PUBLIC") return c.json({ message: "Event not found" }, 404);
    const settings = db.publicSettings.get(event.id);
    const attendees = [...db.registrations.values()].filter((r) => r.eventId === event.id && r.status === "REGISTERED");
    return c.json({ event, settings, attendees }, 200);
  })
  .put("/:id", zValidator("json", updateSchema), (c) => {
    const auth = c.get("auth");
    const payload = c.req.valid("json");
    const event = db.events.get(c.req.param("id"));
    if (!event || event.type !== "PUBLIC") return c.json({ message: "Event not found" }, 404);
    if (event.ownerId !== auth.userId) return c.json({ message: "Forbidden" }, 403);

    const nextEvent = {
      ...event,
      title: payload.title ?? event.title,
      description: payload.description ?? event.description,
      locationText: payload.locationText ?? event.locationText,
      confirmedDate: payload.eventDate ?? event.confirmedDate,
      updatedAt: nowIso()
    };

    const currentSettings = db.publicSettings.get(event.id);
    if (currentSettings) {
      db.publicSettings.set(event.id, {
        ...currentSettings,
        eventDate: payload.eventDate ?? currentSettings.eventDate,
        eventSlot: payload.eventSlot ?? currentSettings.eventSlot,
        capacity: payload.capacity ?? currentSettings.capacity,
        category: payload.category ?? currentSettings.category,
        admissionMode: payload.admissionMode ?? currentSettings.admissionMode
      });
    }

    db.events.set(event.id, nextEvent);
    return c.json({ event: nextEvent, settings: db.publicSettings.get(event.id) }, 200);
  })
  .delete("/:id", (c) => {
    const auth = c.get("auth");
    const event = db.events.get(c.req.param("id"));
    if (!event || event.type !== "PUBLIC") return c.json({ message: "Event not found" }, 404);
    if (event.ownerId !== auth.userId) return c.json({ message: "Forbidden" }, 403);

    const next = { ...event, status: "CANCELLED" as const, updatedAt: nowIso() };
    db.events.set(event.id, next);
    return c.json({ event: next }, 200);
  })
  .post("/:id/registrations", (c) => {
    const auth = c.get("auth");
    const event = db.events.get(c.req.param("id"));
    if (!event || event.type !== "PUBLIC") return c.json({ message: "Event not found" }, 404);
    const settings = db.publicSettings.get(event.id);
    if (!settings) return c.json({ message: "Event settings not found" }, 404);

    const active = [...db.registrations.values()].filter((r) => r.eventId === event.id && r.status === "REGISTERED");
    const waitlist = [...db.registrations.values()].filter((r) => r.eventId === event.id && r.status === "WAITLIST");
    const mineActive = active.find((r) => r.userId === auth.userId);
    const mineWaitlist = waitlist.find((r) => r.userId === auth.userId);
    if (mineActive) return c.json({ message: "Already registered" }, 409);
    if (mineWaitlist) return c.json({ message: "Already in waitlist" }, 409);

    if (active.length < settings.capacity) {
      const registration = {
        id: randomUUID(),
        eventId: event.id,
        userId: auth.userId,
        status: "REGISTERED" as const,
        position: null,
        createdAt: nowIso()
      };
      db.registrations.set(registration.id, registration);
      return c.json({ registration }, 201);
    }

    const nextPosition = waitlist.reduce((max, r) => Math.max(max, r.position ?? 0), 0) + 1;
    const registration = {
      id: randomUUID(),
      eventId: event.id,
      userId: auth.userId,
      status: "WAITLIST" as const,
      position: nextPosition,
      createdAt: nowIso()
    };
    db.registrations.set(registration.id, registration);
    return c.json({ registration }, 201);
  })
  .delete("/:id/registrations/me", (c) => {
    const auth = c.get("auth");
    const event = db.events.get(c.req.param("id"));
    if (!event || event.type !== "PUBLIC") return c.json({ message: "Event not found" }, 404);

    const registration = [...db.registrations.values()].find(
      (r) => r.eventId === event.id && r.userId === auth.userId && (r.status === "REGISTERED" || r.status === "WAITLIST")
    );
    if (!registration) return c.json({ message: "Registration not found" }, 404);

    db.registrations.set(registration.id, { ...registration, status: "CANCELLED", position: null });

    if (registration.status === "REGISTERED") {
      const waitlist = [...db.registrations.values()]
        .filter((r) => r.eventId === event.id && r.status === "WAITLIST")
        .sort((a, b) => (a.position ?? Number.MAX_SAFE_INTEGER) - (b.position ?? Number.MAX_SAFE_INTEGER));
      const next = waitlist[0];
      if (next) {
        const promoted = { ...next, status: "REGISTERED" as const, position: null };
        db.registrations.set(next.id, promoted);
        return c.json({ ok: true, promoted }, 200);
      }
    }

    return c.json({ ok: true }, 200);
  })
  .get("/:id/waitlist", (c) => {
    const auth = c.get("auth");
    const event = db.events.get(c.req.param("id"));
    if (!event || event.type !== "PUBLIC") return c.json({ message: "Event not found" }, 404);
    if (event.ownerId !== auth.userId) return c.json({ message: "Forbidden" }, 403);

    const waitlist = [...db.registrations.values()]
      .filter((r) => r.eventId === event.id && r.status === "WAITLIST")
      .sort((a, b) => (a.position ?? Number.MAX_SAFE_INTEGER) - (b.position ?? Number.MAX_SAFE_INTEGER));
    return c.json({ waitlist }, 200);
  })
  .get("/:id/registrations", (c) => {
    const auth = c.get("auth");
    const event = db.events.get(c.req.param("id"));
    if (!event || event.type !== "PUBLIC") return c.json({ message: "Event not found" }, 404);
    if (event.ownerId !== auth.userId) return c.json({ message: "Forbidden" }, 403);

    const format = c.req.query("format");
    const rows = [...db.registrations.values()].filter((r) => r.eventId === event.id);

    if (format === "csv") {
      const header = "registration_id,user_id,status,position,created_at";
      const lines = rows.map((r) =>
        [r.id, r.userId, r.status, r.position ?? "", r.createdAt].map(csvEscape).join(",")
      );
      return c.body([header, ...lines].join("\n"), 200, {
        "Content-Type": "text/csv; charset=utf-8"
      });
    }

    return c.json({ registrations: rows }, 200);
  });
