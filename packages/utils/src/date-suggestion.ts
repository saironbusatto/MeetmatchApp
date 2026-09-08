// date-suggestion.ts
//
// Duas gerações do algoritmo de melhor par:
//
// 1) LEGADO (`scoreDay` / `maxPossibleScore` / `suggestDate`): melhor DIA com peso
//    multiplicativo de key-person (antigo modelo). Mantido apenas para não quebrar
//    os clientes atuais (rotas `private-events`) e os testes antigos. Não evolui.
//
// 2) V2 (`scoreSlot` / `maxPossibleSlotScore` / `suggestSlot`): melhor PAR (dia × turno)
//    seguindo o modelo reconciliado em wiki/product/business-rules.md (2026-09-07):
//    key person como GATE (não peso), quórum obrigatório, grade de turnos,
//    multi-seleção e MAYBE por par, multiplicador de indicação 1.5×n (sem teto),
//    janela de 1 dia com re-match e desempate por par mais cedo.

export type AvailabilityChoice = "YES" | "MAYBE" | "NO";

// ---------------------------------------------------------------------------
// Tipos V2 — grade dia × turno
// ---------------------------------------------------------------------------

/** Turnos fixos (business-rules D15.1). Ordem do enum é a ordem de desempate. */
export const TIME_SLOTS = ["MANHA", "TARDE", "NOITE", "ALTAS_HORAS"] as const;
export type TimeSlot = (typeof TIME_SLOTS)[number];

export type SlotChoice = "YES" | "MAYBE" | "NO";

export interface SlotResponse {
  participantId: string;
  choice: SlotChoice;
}

/** Um par (dia, turno) já votado. */
export interface SlotVote {
  date: string; // ISO date (yyyy-mm-dd)
  slot: TimeSlot;
  responses: SlotResponse[];
}

/** Indicações de participantes (D2/D5/D12). Só valem se quem foi indicado já aceitou o convite. */
export interface Indication {
  participantId: string;
  /** Ids das pessoas que indicaram (nº de indicadores define o multiplicador 1.5×n). */
  invitedBy: string[];
}

export interface SuggestSlotInput {
  /** Grade de votação (já filtrada pelos convidados que aceitaram — D5). */
  slots: SlotVote[];
  /** Total de convidados que aceitaram o convite e podem votar. */
  participantCount: number;
  /** Quórum mínimo (inteiro ≥ 1) — conta apenas YES no par (D15). */
  quorumMin: number;
  /** Key person = GATE (D1). Sem ela não há candidato. */
  keyPersonId: string | null;
  /** Indicações ativas por participante (opcional). */
  indications?: Indication[];
}

export interface SlotSuggestion {
  date: string;
  slot: TimeSlot;
  score: number;
  confidence: number;
  /** Quantidade de YES no par (contagem do quórum, D15). */
  yesCount: number;
  /** TRUE quando yesCount >= quorumMin. */
  quorumMet: boolean;
  keyPersonState: "YES" | "MAYBE" | "NO" | "NO_RESPONSE";
  reasoning: string;
}

export interface SuggestSlotResult {
  /** Melhor par candidato, ou null se não existir candidato elegível (D1/D20). */
  suggestion: SlotSuggestion | null;
  /** Todos os pares ordenados por score desc / par mais cedo — suporta re-match (D17). */
  ranked: SlotSuggestion[];
  /** Estado da key person agregado para alertas do criador (D20). */
  keyPersonBlocking: boolean;
}

// ---------------------------------------------------------------------------
// V2 — pesos e multiplicadores
// ---------------------------------------------------------------------------

const SLOT_WEIGHTS: Record<SlotChoice, number> = {
  YES: 1,
  MAYBE: 0.5,
  NO: 0
};

/** Indicação: 1.5 × nº de indicadores, sem teto (D2). Sem indicação: 1. */
export function indicationMultiplier(participantId: string, indications?: Indication[]): number {
  if (!indications) return 1;
  const entry = indications.find((i) => i.participantId === participantId);
  if (!entry || entry.invitedBy.length === 0) return 1;
  return 1.5 * entry.invitedBy.length;
}

/**
 * Peso de um voto dentro do par. A key person NÃO recebe multiplicador de indicação
 * (é gate, D1); NO nunca é boostado por indicação (D2/D5).
 */
export function weightedSlotResponse(
  response: SlotResponse,
  keyPersonId: string | null,
  indications?: Indication[]
): number {
  const base = SLOT_WEIGHTS[response.choice];
  if (response.choice === "NO") return 0;
  if (keyPersonId && response.participantId === keyPersonId) return base;
  return base * indicationMultiplier(response.participantId, indications);
}

/** Estado da key person num par (D1). Qualquer coisa diferente de YES elimina o par. */
export function keyPersonStateInVote(vote: SlotVote, keyPersonId: string | null): "YES" | "MAYBE" | "NO" | "NO_RESPONSE" {
  if (!keyPersonId) return "YES";
  const found = vote.responses.find((r) => r.participantId === keyPersonId);
  return found ? found.choice : "NO_RESPONSE";
}

// ---------------------------------------------------------------------------
// V2 — score de par
// ---------------------------------------------------------------------------

export function scoreSlot(
  vote: SlotVote,
  keyPersonId: string | null,
  indications?: Indication[]
): number {
  return vote.responses.reduce(
    (sum, r) => sum + weightedSlotResponse(r, keyPersonId, indications),
    0
  );
}

/**
 * Score máximo teórico do par (denominador da confidence).
 * Cada convidado presente na grade conta 1.0 × multiplicador de indicação; key entra como 1
 * (não é peso, não infla o teto).
 */
export function maxPossibleSlotScore(
  votes: SlotVote[],
  keyPersonId: string | null,
  participantCount: number,
  indications?: Indication[]
): number {
  if (participantCount <= 0) return 0;
  const participants = new Set<string>();
  for (const v of votes) for (const r of v.responses) participants.add(r.participantId);
  let sum = 0;
  for (const pid of participants) {
    if (keyPersonId && pid === keyPersonId) sum += 1;
    else sum += indicationMultiplier(pid, indications);
  }
  return sum > 0 ? sum : participantCount;
}

/** Ordenação estável: score desc, depois par mais cedo (data, depois turno) — business-rules. */
export function sortSlots<T extends { date: string; slot: TimeSlot; score: number }>(a: T, b: T): number {
  if (b.score !== a.score) return b.score - a.score;
  if (a.date !== b.date) return a.date.localeCompare(b.date);
  return TIME_SLOTS.indexOf(a.slot) - TIME_SLOTS.indexOf(b.slot);
}

function slotLabel(slot: TimeSlot): string {
  const map: Record<TimeSlot, string> = {
    MANHA: "manhã",
    TARDE: "tarde",
    NOITE: "noite",
    ALTAS_HORAS: "altas horas"
  };
  return map[slot];
}

function formatSlotReasoning(
  dateISO: string,
  slot: TimeSlot,
  yesCount: number,
  participantCount: number,
  keyPersonState: "YES" | "MAYBE" | "NO" | "NO_RESPONSE"
): string {
  const date = new Date(`${dateISO}T00:00:00Z`);
  const weekday = new Intl.DateTimeFormat("pt-BR", { weekday: "long", timeZone: "UTC" }).format(date);
  const day = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "short", timeZone: "UTC" }).format(date);

  let keyText: string;
  if (keyPersonState === "YES") keyText = "A pessoa-chave topar esse par.";
  else if (keyPersonState === "MAYBE") keyText = "A pessoa-chave só marcou 'talvez' — par eliminado.";
  else if (keyPersonState === "NO") keyText = "A pessoa-chave disse não — par eliminado.";
  else keyText = "A pessoa-chave ainda não respondeu — par sem candidatura.";

  return `${weekday}, ${day} · ${slotLabel(slot)} — ${yesCount} de ${participantCount} podem. ${keyText}`;
}

// ---------------------------------------------------------------------------
// V2 — sugestão de melhor par
// ---------------------------------------------------------------------------

export function suggestSlot(input: SuggestSlotInput): SuggestSlotResult {
  if (input.slots.length === 0) {
    throw new Error("At least one slot is required to suggest the best slot.");
  }
  if (input.quorumMin < 1) {
    throw new Error("quorumMin must be >= 1.");
  }

  const maxScore = maxPossibleSlotScore(
    input.slots,
    input.keyPersonId,
    input.participantCount,
    input.indications
  );

  const ranked = input.slots
    .map((vote) => {
      const keyState = keyPersonStateInVote(vote, input.keyPersonId);
      const score = scoreSlot(vote, input.keyPersonId, input.indications);
      const yesCount = vote.responses.filter((r) => r.choice === "YES").length;
      const eligible = keyState === "YES"; // D1: só YES do gate entra
      return {
        vote,
        keyState,
        score,
        yesCount,
        eligible,
        quorumMet: yesCount >= input.quorumMin
      };
    })
    .filter((s) => s.eligible)
    .sort((a, b) =>
      sortSlots(
        { ...a, date: a.vote.date, slot: a.vote.slot },
        { ...b, date: b.vote.date, slot: b.vote.slot }
      )
    );

  const suggestions: SlotSuggestion[] = ranked.map((s) => ({
    date: s.vote.date,
    slot: s.vote.slot,
    score: s.score,
    confidence: maxScore > 0 ? Number((s.score / maxScore).toFixed(4)) : 0,
    yesCount: s.yesCount,
    quorumMet: s.quorumMet,
    keyPersonState: s.keyState,
    reasoning: formatSlotReasoning(s.vote.date, s.vote.slot, s.yesCount, input.participantCount, s.keyState)
  }));

  const eligibleWithQuorum = suggestions.filter((s) => s.quorumMet);
  const bestSuggestion = eligibleWithQuorum[0] ?? null;

  // D20: key sem nenhum YES na grade bloqueia candidatura.
  const keyHasAnyYes = input.slots.some(
    (v) => input.keyPersonId && v.responses.some((r) => r.participantId === input.keyPersonId && r.choice === "YES")
  );
  const keyPersonBlocking = input.keyPersonId !== null && !keyHasAnyYes;

  return {
    suggestion: bestSuggestion,
    ranked: suggestions,
    keyPersonBlocking
  };
}

// ===========================================================================
// LEGADO (não evolui) — mantido para compat com clientes/rotas atuais
// ===========================================================================

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

const LEGACY_WEIGHTS: Record<AvailabilityChoice, number> = {
  YES: 1,
  MAYBE: 0.5,
  NO: 0
};

const DEFAULT_KEY_PERSON_WEIGHT = 3;

/** @deprecated Old day-only algorithm; use suggestSlot (V2 grade). */
export function scoreDay(
  responses: DayResponse[],
  keyPersonId?: string | null,
  keyPersonWeight: number = DEFAULT_KEY_PERSON_WEIGHT
): number {
  return responses.reduce((sum, current) => {
    const baseScore = LEGACY_WEIGHTS[current.response];
    const multiplier = keyPersonId && current.participantId === keyPersonId ? keyPersonWeight : 1;
    return sum + baseScore * multiplier;
  }, 0);
}

/** @deprecated Old day-only algorithm; use maxPossibleSlotScore (V2). */
export function maxPossibleScore(
  participantCount: number,
  keyPersonId?: string | null,
  keyPersonWeight: number = DEFAULT_KEY_PERSON_WEIGHT
): number {
  if (participantCount <= 0) return 0;
  if (!keyPersonId) return participantCount;
  return Math.max(participantCount - 1, 0) + keyPersonWeight;
}

/** @deprecated Old day-only algorithm; use suggestSlot (V2 grade). */
function legacyFormatReasoning(dateISO: string, yesCount: number, participantCount: number, keyPersonFree: boolean): string {
  const date = new Date(`${dateISO}T00:00:00Z`);
  const weekday = new Intl.DateTimeFormat("pt-BR", { weekday: "long", timeZone: "UTC" }).format(date);
  const day = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "short", timeZone: "UTC" }).format(date);
  const keyPersonText = keyPersonFree ? "A pessoa-chave está livre." : "A pessoa-chave não confirmou disponibilidade.";
  return `${weekday}, ${day} — ${yesCount} de ${participantCount} podem. ${keyPersonText}`;
}

/** @deprecated Old day-only algorithm; use suggestSlot (V2 grade). */
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
      if (b.score !== a.score) return b.score - a.score;
      return a.date.localeCompare(b.date);
    });

  const best = ranked[0];
  if (!best) throw new Error("Unable to compute best date.");
  const confidence = maxScore > 0 ? Number((best.score / maxScore).toFixed(4)) : 0;

  return {
    date: best.date,
    score: best.score,
    confidence,
    reasoning: legacyFormatReasoning(best.date, best.yesCount, input.participantCount, best.keyPersonFree)
  };
}