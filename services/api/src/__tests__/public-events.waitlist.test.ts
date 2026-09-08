import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { api, clearDb, setTestEnv, tokenFor } from "./helpers";

describe("public events — waitlist (D27-D30) e admissionMode", () => {
  beforeAll(() => {
    setTestEnv();
  });

  const OWNER = "owner-pub";
  const USER_A = "user-a";
  const USER_B = "user-b";
  const USER_C = "user-c";

  let eventId: string;

  beforeEach(async () => {
    await clearDb();
    const res = await api("/api/v1/public-events", {
      method: "POST",
      token: tokenFor(OWNER),
      body: {
        title: "Futebol na quadra",
        eventDate: "2026-09-20",
        capacity: 2,
        admissionMode: "CONFIAVEL"
      }
    });
    expect(res.status).toBe(201);
    eventId = res.body.event.id as string;
  });

  async function register(userId: string) {
    return api(`/api/v1/public-events/${eventId}/registrations`, {
      method: "POST",
      token: tokenFor(userId)
    });
  }

  async function cancelMe(userId: string) {
    return api(`/api/v1/public-events/${eventId}/registrations/me`, {
      method: "DELETE",
      token: tokenFor(userId)
    });
  }

  it("capacidade cheia → registra na WAITLIST com posições FIFO", async () => {
    await register(USER_A);
    await register(USER_B);

    const c = await register(USER_C);
    expect(c.status).toBe(201);
    expect(c.body.registration.status).toBe("WAITLIST");
    expect(c.body.registration.position).toBe(1);

    const event = await api(`/api/v1/public-events/${eventId}`, {
      token: tokenFor(OWNER)
    });
    expect(event.body.event.status).toBe("OPEN");
    expect(event.body.attendees).toHaveLength(2);
  });

  it("novo registro depois da capacidade → continua FIFO (position 2)", async () => {
    await register(USER_A);
    await register(USER_B);
    await register(USER_C);

    const d = await api(`/api/v1/public-events/${eventId}/registrations`, {
      method: "POST",
      token: tokenFor("user-d")
    });
    expect(d.status).toBe(201);
    expect(d.body.registration.status).toBe("WAITLIST");
    expect(d.body.registration.position).toBe(2);
  });

  it("rejeita registro duplicado de REGISTERED (409)", async () => {
    await register(USER_A);
    const dup = await register(USER_A);
    expect(dup.status).toBe(409);
    expect(dup.body.message).toBe("Already registered");
  });

  it("rejeita registro duplicado de WAITLIST (409)", async () => {
    await register(USER_A);
    await register(USER_B);
    await register(USER_C);
    const dup = await register(USER_C);
    expect(dup.status).toBe(409);
    expect(dup.body.message).toBe("Already in waitlist");
  });

  it("cancelamento de REGISTERED promove o primeiro da WAITLIST", async () => {
    await register(USER_A);
    await register(USER_B);
    await register(USER_C);

    const cancelled = await cancelMe(USER_A);
    expect(cancelled.status).toBe(200);
    expect(cancelled.body.promoted.status).toBe("REGISTERED");
    expect(cancelled.body.promoted.userId).toBe(USER_C);
    expect(cancelled.body.promoted.position).toBeNull();

    const event = await api(`/api/v1/public-events/${eventId}`, {
      token: tokenFor(OWNER)
    });
    const active = event.body.attendees;
    expect(active.map((r: { userId: string }) => r.userId)).toEqual([USER_B, USER_C]);
  });

  it("cancelamento de WAITLIST não promove ninguém", async () => {
    await register(USER_A);
    await register(USER_B);
    await register(USER_C);

    const cancelled = await cancelMe(USER_C);
    expect(cancelled.status).toBe(200);
    expect(cancelled.body.promoted).toBeUndefined();

    const event = await api(`/api/v1/public-events/${eventId}`, {
      token: tokenFor(OWNER)
    });
    expect(event.body.attendees).toHaveLength(2);
  });

  it("GET /:id/waitlist é restrito ao dono (403 para terceiros)", async () => {
    await register(USER_A);
    await register(USER_B);
    await register(USER_C);

    const ok = await api(`/api/v1/public-events/${eventId}/waitlist`, {
      token: tokenFor(OWNER)
    });
    expect(ok.status).toBe(200);
    expect(ok.body.waitlist).toHaveLength(1);
    expect(ok.body.waitlist[0].userId).toBe(USER_C);
    expect(ok.body.waitlist[0].position).toBe(1);

    const forbidden = await api(`/api/v1/public-events/${eventId}/waitlist`, {
      token: tokenFor(USER_A)
    });
    expect(forbidden.status).toBe(403);
  });

  it("GET /:id/registrations?format=csv inclui a coluna position", async () => {
    await register(USER_A);
    await register(USER_B);
    await register(USER_C);

    const csv = await api(`/api/v1/public-events/${eventId}/registrations`, {
      token: tokenFor(OWNER),
      query: { format: "csv" }
    });
    expect(csv.status).toBe(200);
    expect(csv.text).toContain("registration_id,user_id,status,position,created_at");
    expect(csv.text).toContain("WAITLIST");
    expect(csv.text).toMatch(/,"WAITLIST",1,|WAITLIST,1,/);
  });

  it("persiste o admissionMode (CONFIAVEL) e default FIRST_COME", async () => {
    const detailed = await api(`/api/v1/public-events/${eventId}`, {
      token: tokenFor(OWNER)
    });
    expect(detailed.body.settings.admissionMode).toBe("CONFIAVEL");

    const second = await api("/api/v1/public-events", {
      method: "POST",
      token: tokenFor(OWNER),
      body: {
        title: "Volley de praia",
        eventDate: "2026-09-21",
        capacity: 10
      }
    });
    expect(second.status).toBe(201);
    const secondId = second.body.event.id as string;
    const details2 = await api(`/api/v1/public-events/${secondId}`, {
      token: tokenFor(OWNER)
    });
    expect(details2.body.settings.admissionMode).toBe("FIRST_COME");
  });
});