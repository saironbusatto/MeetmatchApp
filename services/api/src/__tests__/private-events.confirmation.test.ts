import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { api, clearDb, setTestEnv, tokenFor } from "./helpers";

describe("private events — janela de confirmação de 1 dia (D17/D18)", () => {
  beforeAll(() => {
    setTestEnv();
  });

  const OWNER = "00000000-0000-4000-8000-000000000001";
  const KEY = "00000000-0000-4000-8000-000000000002";
  const GUEST_1 = "00000000-0000-4000-8000-000000000003";

  const DAY = "2026-09-10";

  let eventId: string;

  beforeEach(async () => {
    await clearDb();
    const res = await api("/api/v1/private-events", {
      method: "POST",
      token: tokenFor(OWNER),
      body: {
        title: "Almoço Q3",
        dateWindowStart: DAY,
        dateWindowEnd: DAY,
        keyPersonUserId: KEY,
        quorumMin: 2
      }
    });
    expect(res.status).toBe(201);
    eventId = res.body.event.id as string;
  });

  async function addParticipant(userId: string) {
    const res = await api(`/api/v1/private-events/${eventId}/participants`, {
      method: "POST",
      token: tokenFor(OWNER),
      body: { userId }
    });
    expect(res.status).toBe(201);
    const participant = res.body.participant;
    const accept = await api(`/api/v1/invites/${participant.inviteToken}/accept`, {
      method: "POST",
      token: tokenFor(userId)
    });
    expect(accept.status).toBe(200);
    return participant;
  }

  async function postAvailability(userId: string, responses: Array<{ date: string; slot: "MANHA" | "TARDE"; response: "YES" | "NO" }>) {
    const res = await api(`/api/v1/private-events/${eventId}/availability`, {
      method: "POST",
      token: tokenFor(userId),
      body: { responses }
    });
    expect(res.status).toBe(200);
    return res;
  }

  async function confirmEvent() {
    const res = await api(`/api/v1/private-events/${eventId}/confirm`, {
      method: "POST",
      token: tokenFor(OWNER)
    });
    expect(res.status).toBe(200);
    return res;
  }

  async function diaDoBolo(userId: string, action: "leave" | "join") {
    return api(`/api/v1/private-events/${eventId}/dia-do-bolo`, {
      method: "POST",
      token: tokenFor(userId),
      body: { action }
    });
  }

  function bothSlots(choice: "YES" | "NO") {
    return [
      { date: DAY, slot: "MANHA" as const, response: choice },
      { date: DAY, slot: "TARDE" as const, response: choice }
    ];
  }

  it("confirm abre uma janela de confirmação de ~24h", async () => {
    await addParticipant(KEY);
    await addParticipant(GUEST_1);

    await postAvailability(OWNER, bothSlots("YES"));
    await postAvailability(KEY, bothSlots("YES"));
    await postAvailability(GUEST_1, bothSlots("YES"));

    const confirm = await confirmEvent();
    expect(confirm.body.event.status).toBe("CONFIRMED");
    expect(confirm.body.event.confirmedSlot).toBe("MANHA");

    const windowEnds = new Date(confirm.body.event.confirmationWindowEndsAt as string).getTime();
    const now = Date.now();
    const windowMs = 24 * 60 * 60 * 1000;
    expect(windowEnds).toBeGreaterThan(now + windowMs - 5_000);
    expect(windowEnds).toBeLessThanOrEqual(now + windowMs + 5_000);
  });

  it("dia-do-bolo leave da key person derruba o par → re-match para o próximo melhor par", async () => {
    await addParticipant(KEY);
    await addParticipant(GUEST_1);

    await postAvailability(OWNER, bothSlots("YES"));
    await postAvailability(KEY, bothSlots("YES"));
    await postAvailability(GUEST_1, bothSlots("YES"));

    const confirm = await confirmEvent();
    expect(confirm.body.event.confirmedSlot).toBe("MANHA");

    const leave = await diaDoBolo(KEY, "leave");
    expect(leave.status).toBe(200);
    expect(leave.body.rematched).toBe(true);
    expect(leave.body.noDate).toBe(false);
    expect(leave.body.event.status).toBe("CONFIRMED");
    expect(leave.body.event.confirmedSlot).toBe("TARDE");
    expect(leave.body.event.confirmationWindowEndsAt).toBeTruthy();
  });

  it("quando a key person deixa o único par elegível → NO_DATE", async () => {
    await addParticipant(KEY);

    await postAvailability(OWNER, [{ date: DAY, slot: "MANHA", response: "YES" }]);
    await postAvailability(KEY, [{ date: DAY, slot: "MANHA", response: "YES" }]);

    const confirm = await confirmEvent();
    expect(confirm.body.event.confirmedSlot).toBe("MANHA");

    const res = await diaDoBolo(KEY, "leave");
    expect(res.status).toBe(200);
    expect(res.body.noDate).toBe(true);
    expect(res.body.rematched).toBe(false);
    expect(res.body.event.status).toBe("NO_DATE");
    expect(res.body.event.confirmedDate).toBeNull();
    expect(res.body.event.confirmationWindowEndsAt).toBeNull();
  });

  it("leave que mantém o par elegível NÃO gera re-match", async () => {
    await addParticipant(KEY);
    await addParticipant(GUEST_1);

    await postAvailability(OWNER, bothSlots("YES"));
    await postAvailability(KEY, bothSlots("YES"));
    await postAvailability(GUEST_1, bothSlots("YES"));

    await confirmEvent();

    const res = await diaDoBolo(GUEST_1, "leave");
    expect(res.status).toBe(200);
    expect(res.body.rematched).toBe(false);
    expect(res.body.event.status).toBe("CONFIRMED");
    expect(res.body.event.confirmedSlot).toBe("MANHA");
  });

  it("rejeita leave/join quando a janela de confirmação está fechada (409)", async () => {
    await addParticipant(KEY);

    await postAvailability(OWNER, [{ date: DAY, slot: "MANHA", response: "YES" }]);
    await postAvailability(KEY, [{ date: DAY, slot: "MANHA", response: "YES" }]);

    await confirmEvent();

    const { db } = await import("../store");
    const stored = db.events.get(eventId)!;
    db.events.set(eventId, {
      ...stored,
      confirmationWindowEndsAt: new Date(Date.now() - 1_000).toISOString()
    });

    const res = await diaDoBolo(KEY, "leave");
    expect(res.status).toBe(409);
    expect(res.body.message).toBe("Confirmation window is closed");
  });

  it("rejeita dia-do-bolo quando o evento não está CONFIRMED (409)", async () => {
    const res = await diaDoBolo(OWNER, "leave");
    expect(res.status).toBe(409);
    expect(res.body.message).toBe("Event is not confirmed");
  });

  it("rejeita dia-do-bolo para quem não é participante do evento (403)", async () => {
    await addParticipant(KEY);
    await postAvailability(OWNER, [{ date: DAY, slot: "MANHA", response: "YES" }]);
    await postAvailability(KEY, [{ date: DAY, slot: "MANHA", response: "YES" }]);
    await confirmEvent();

    const res = await diaDoBolo("00000000-0000-4000-8000-00000000ffff", "leave");
    expect(res.status).toBe(403);
    expect(res.body.message).toBe("Not a participant of this event");
  });
});