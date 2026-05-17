import { describe, expect, it } from "vitest";
import { maxPossibleScore, scoreDay, suggestDate } from "../date-suggestion";

describe("date suggestion algorithm", () => {
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
