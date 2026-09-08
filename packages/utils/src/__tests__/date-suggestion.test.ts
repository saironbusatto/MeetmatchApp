import { describe, expect, it } from "vitest";
import {
  indicationMultiplier,
  keyPersonStateInVote,
  maxPossibleSlotScore,
  maxPossibleScore,
  scoreDay,
  scoreSlot,
  suggestDate,
  suggestSlot,
  TIME_SLOTS
} from "../date-suggestion";

describe("date suggestion algorithm — legacy (day-only, deprecated)", () => {
  it("scores all YES without key person", () => {
    const score = scoreDay(
      [
        { participantId: "1", response: "YES" },
        { participantId: "2", response: "YES" }
      ],
      null
    );

    expect(score).toBe(2);
  });

  it("handles YES, MAYBE and NO mix", () => {
    const score = scoreDay(
      [
        { participantId: "1", response: "YES" },
        { participantId: "2", response: "MAYBE" },
        { participantId: "3", response: "NO" }
      ],
      null
    );

    expect(score).toBe(1.5);
  });

  it("applies key person weight with MAYBE", () => {
    const score = scoreDay(
      [
        { participantId: "key", response: "MAYBE" },
        { participantId: "2", response: "YES" }
      ],
      "key",
      3
    );

    expect(score).toBe(2.5);
  });

  it("uses earliest date as tie breaker", () => {
    const result = suggestDate({
      participantCount: 2,
      dates: [
        {
          date: "2026-06-05",
          responses: [
            { participantId: "1", response: "YES" },
            { participantId: "2", response: "NO" }
          ]
        },
        {
          date: "2026-06-04",
          responses: [
            { participantId: "1", response: "YES" },
            { participantId: "2", response: "NO" }
          ]
        }
      ]
    });

    expect(result.date).toBe("2026-06-04");
  });

  it("returns confidence 0 when all are NO", () => {
    const result = suggestDate({
      participantCount: 2,
      dates: [
        {
          date: "2026-06-04",
          responses: [
            { participantId: "1", response: "NO" },
            { participantId: "2", response: "NO" }
          ]
        }
      ]
    });

    expect(result.score).toBe(0);
    expect(result.confidence).toBe(0);
  });

  it("supports a one-day window", () => {
    const result = suggestDate({
      participantCount: 1,
      dates: [
        {
          date: "2026-06-04",
          responses: [{ participantId: "1", response: "YES" }]
        }
      ]
    });

    expect(result.date).toBe("2026-06-04");
    expect(result.score).toBe(1);
  });

  it("computes max possible score with key person", () => {
    expect(maxPossibleScore(4, "key", 3)).toBe(6);
  });
});

describe("date suggestion V2 — grid (date × time slot, business-rules D15.1)", () => {
  const baseVotes = (): Parameters<typeof suggestSlot>[0] => ({
    participantCount: 4,
    quorumMin: 3,
    keyPersonId: "key",
    slots: [
      {
        date: "2026-06-05",
        slot: "NOITE",
        responses: [
          { participantId: "key", choice: "YES" },
          { participantId: "a", choice: "YES" },
          { participantId: "b", choice: "MAYBE" },
          { participantId: "c", choice: "NO" }
        ]
      },
      {
        date: "2026-06-05",
        slot: "TARDE",
        responses: [
          { participantId: "key", choice: "YES" },
          { participantId: "a", choice: "YES" },
          { participantId: "b", choice: "YES" },
          { participantId: "c", choice: "YES" }
        ]
      },
      {
        date: "2026-06-04",
        slot: "NOITE",
        responses: [
          { participantId: "key", choice: "YES" },
          { participantId: "a", choice: "YES" },
          { participantId: "b", choice: "YES" },
          { participantId: "c", choice: "NO" }
        ]
      }
    ]
  });

  it("exposes the four fixed time slots", () => {
    expect(TIME_SLOTS).toEqual(["MANHA", "TARDE", "NOITE", "ALTAS_HORAS"]);
  });

  it("picks the best (date, slot) pair by weighted score", () => {
    const result = suggestSlot(baseVotes());

    expect(result.suggestion?.date).toBe("2026-06-05");
    expect(result.suggestion?.slot).toBe("TARDE");
    expect(result.suggestion?.yesCount).toBe(4);
    expect(result.suggestion?.quorumMet).toBe(true);
    expect(result.suggestion?.keyPersonState).toBe("YES");
  });

  it("breaks ties by earliest date, then slot order", () => {
    const result = suggestSlot({
      participantCount: 3,
      quorumMin: 2,
      keyPersonId: "key",
      slots: [
        {
          date: "2026-06-05",
          slot: "MANHA",
          responses: [
            { participantId: "key", choice: "YES" },
            { participantId: "a", choice: "YES" },
            { participantId: "b", choice: "NO" }
          ]
        },
        {
          date: "2026-06-04",
          slot: "NOITE",
          responses: [
            { participantId: "key", choice: "YES" },
            { participantId: "a", choice: "YES" },
            { participantId: "b", choice: "NO" }
          ]
        }
      ]
    });

    expect(result.suggestion?.date).toBe("2026-06-04");
    expect(result.suggestion?.slot).toBe("NOITE");
  });

  it("uses the key person as a gate: MAYBE or NO kills the pair (D1)", () => {
    const input = baseVotes();
    input.slots.forEach((s) => {
      s.responses = s.responses.map((r) =>
        r.participantId === "key" ? { ...r, choice: "MAYBE" as const } : r
      );
    });

    const result = suggestSlot(input);

    expect(result.suggestion).toBeNull();
    expect(result.ranked.length).toBe(0);
    expect(result.keyPersonBlocking).toBe(true);
  });

  it("key person without any YES blocks candidacy and flags D20 alert", () => {
    const result = suggestSlot({
      participantCount: 3,
      quorumMin: 2,
      keyPersonId: "key",
      slots: [
        {
          date: "2026-06-04",
          slot: "NOITE",
          responses: [
            { participantId: "key", choice: "MAYBE" },
            { participantId: "a", choice: "YES" },
            { participantId: "b", choice: "YES" }
          ]
        }
      ]
    });

    expect(result.suggestion).toBeNull();
    expect(result.keyPersonBlocking).toBe(true);
    expect(keyPersonStateInVote({
      date: "2026-06-04",
      slot: "NOITE" as const,
      responses: [
        { participantId: "key", choice: "MAYBE" },
        { participantId: "a", choice: "YES" },
        { participantId: "b", choice: "YES" }
      ]
    }, "key")).toBe("MAYBE");
  });

  it("still ranks candidates that don't meet quorum, choosing none overall (D15)", () => {
    const result = suggestSlot({
      participantCount: 4,
      quorumMin: 4,
      keyPersonId: "key",
      slots: [
        {
          date: "2026-06-04",
          slot: "NOITE",
          responses: [
            { participantId: "key", choice: "YES" },
            { participantId: "a", choice: "YES" },
            { participantId: "b", choice: "YES" },
            { participantId: "c", choice: "NO" }
          ]
        }
      ]
    });

    expect(result.suggestion).toBeNull();
    expect(result.ranked[0]?.quorumMet).toBe(false);
  });

  it("applies the 1.5×n indication multiplier without cap (D2)", () => {
    const score = scoreSlot(
      {
        date: "2026-06-04",
        slot: "NOITE",
        responses: [{ participantId: "b", choice: "YES" }]
      },
      null,
      [{ participantId: "b", invitedBy: ["a", "c"] }]
    );

    expect(score).toBe(3);
    expect(indicationMultiplier("b", [{ participantId: "b", invitedBy: ["a", "c"] }])).toBe(3);
    expect(indicationMultiplier("nobody", [{ participantId: "b", invitedBy: ["a"] }])).toBe(1);
  });

  it("does not boost NO votes with indication multiplier (D5)", () => {
    const score = scoreSlot(
      {
        date: "2026-06-04",
        slot: "NOITE",
        responses: [{ participantId: "b", choice: "NO" }]
      },
      null,
      [{ participantId: "b", invitedBy: ["a", "c"] }]
    );

    expect(score).toBe(0);
  });

  it("does not apply indication multiplier to the key person (D1 gate)", () => {
    const score = scoreSlot(
      {
        date: "2026-06-04",
        slot: "NOITE",
        responses: [{ participantId: "key", choice: "YES" }]
      },
      "key",
      [{ participantId: "key", invitedBy: ["a", "b"] }]
    );

    expect(score).toBe(1);
  });

  it("computes max possible slot score from distinct participants", () => {
    const votes = baseVotes().slots.slice(0, 1);
    const max = maxPossibleSlotScore(votes, "key", 4);

    // key (1) + a (1) + b (1) + c (1) = 4
    expect(max).toBe(4);
  });

  it("computes confidence relative to max possible score", () => {
    const result = suggestSlot(baseVotes());

    // winner TARDE: key+a+b+c all YES → score 4; max = 4 → confidence 1
    expect(result.suggestion?.score).toBe(4);
    expect(result.suggestion?.confidence).toBe(1);
  });

  it("throws when no slots are provided", () => {
    expect(() =>
      suggestSlot({ slots: [], participantCount: 2, quorumMin: 1, keyPersonId: null })
    ).toThrow("At least one slot is required");
  });

  it("throws when quorumMin is below 1", () => {
    expect(() =>
      suggestSlot({
        slots: [
          { date: "2026-06-04", slot: "NOITE", responses: [] }
        ],
        participantCount: 2,
        quorumMin: 0,
        keyPersonId: null
      })
    ).toThrow("quorumMin must be >= 1");
  });

  it("works without a key person (gate not required)", () => {
    const result = suggestSlot({
      participantCount: 2,
      quorumMin: 2,
      keyPersonId: null,
      slots: [
        {
          date: "2026-06-04",
          slot: "NOITE",
          responses: [
            { participantId: "a", choice: "YES" },
            { participantId: "b", choice: "YES" }
          ]
        }
      ]
    });

    expect(result.suggestion?.score).toBe(2);
    expect(result.suggestion?.keyPersonState).toBe("YES");
    expect(result.keyPersonBlocking).toBe(false);
  });

  it("keeps ranked order ready for re-match on the 1-day window (D17)", () => {
    const input = baseVotes();
    // cripple the top pair (TARDE) so a lower-ranked pair must take over on re-match
    const tarde = input.slots.find((s) => s.date === "2026-06-05" && s.slot === "TARDE")!;
    tarde.responses = tarde.responses.map((r) =>
      r.participantId === "c" ? { ...r, choice: "NO" as const } : r
    );

    const result = suggestSlot(input);
    const ranked = result.ranked;

    // TARDE (06-05) drops from 4 → 3, tying 06-04 NOITE; earliest date wins the re-match
    expect(result.suggestion?.date).toBe("2026-06-04");
    expect(result.suggestion?.slot).toBe("NOITE");
    expect(ranked[0]!.slot).toBe("NOITE"); // re-matched pair on top
    expect(ranked).toHaveLength(3); // all three pairs keep key YES → all survive
  });
});