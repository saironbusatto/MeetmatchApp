export type AvailabilityChoice = "YES" | "MAYBE" | "NO";

export interface DayResponse {
  participantId: string;
  response: AvailabilityChoice;
}

export interface SuggestionInput {
  dates: Array<{
    date: string;
    responses: DayResponse[];
  }>;
  participantCount: number;
  keyPersonId?: string | null;
  keyPersonWeight?: number;
}

export interface SuggestionResult {
  date: string;
  score: number;
  confidence: number;
  reasoning: string;
}

const WEIGHTS: Record<AvailabilityChoice, number> = {
  YES: 1,
  MAYBE: 0.5,
  NO: 0
};

const DEFAULT_KEY_PERSON_WEIGHT = 3;

export function scoreDay(
  responses: DayResponse[],
  keyPersonId?: string | null,
  keyPersonWeight: number = DEFAULT_KEY_PERSON_WEIGHT
): number {
  return responses.reduce((sum, current) => {
    const baseScore = WEIGHTS[current.response];
    const multiplier = keyPersonId && current.participantId === keyPersonId ? keyPersonWeight : 1;
    return sum + baseScore * multiplier;
  }, 0);
}

export function maxPossibleScore(
  participantCount: number,
  keyPersonId?: string | null,
  keyPersonWeight: number = DEFAULT_KEY_PERSON_WEIGHT
): number {
  if (participantCount <= 0) {
    return 0;
  }

  if (!keyPersonId) {
    return participantCount;
  }

  return Math.max(participantCount - 1, 0) + keyPersonWeight;
}

function formatReasoning(dateISO: string, yesCount: number, participantCount: number, keyPersonFree: boolean): string {
  const date = new Date(`${dateISO}T00:00:00Z`);
  const weekday = new Intl.DateTimeFormat("pt-BR", { weekday: "long", timeZone: "UTC" }).format(date);
  const day = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "short", timeZone: "UTC" }).format(date);

  const keyPersonText = keyPersonFree ? "A pessoa-chave está livre." : "A pessoa-chave não confirmou disponibilidade.";
  return `${weekday}, ${day} — ${yesCount} de ${participantCount} podem. ${keyPersonText}`;
}

export function suggestDate(input: SuggestionInput): SuggestionResult {
  if (input.dates.length === 0) {
    throw new Error("At least one date is required to suggest the best date.");
  }

  const keyPersonWeight = input.keyPersonWeight ?? DEFAULT_KEY_PERSON_WEIGHT;
  const maxScore = maxPossibleScore(input.participantCount, input.keyPersonId, keyPersonWeight);

  const ranked = [...input.dates]
    .map((day) => ({
      date: day.date,
      score: scoreDay(day.responses, input.keyPersonId, keyPersonWeight),
      yesCount: day.responses.filter((item) => item.response === "YES").length,
      keyPersonFree: input.keyPersonId
        ? day.responses.some((item) => item.participantId === input.keyPersonId && item.response !== "NO")
        : false
    }))
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return a.date.localeCompare(b.date);
    });

  const best = ranked[0];
  if (!best) {
    throw new Error("Unable to compute best date.");
  }
  const confidence = maxScore > 0 ? Number((best.score / maxScore).toFixed(4)) : 0;

  return {
    date: best.date,
    score: best.score,
    confidence,
    reasoning: formatReasoning(best.date, best.yesCount, input.participantCount, best.keyPersonFree)
  };
}
