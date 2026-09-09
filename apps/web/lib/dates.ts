import type { TimeSlot } from "@farmei/types";

export const SLOT_LABELS: Record<TimeSlot, string> = {
  MANHA: "Manhã",
  TARDE: "Tarde",
  NOITE: "Noite",
  ALTAS_HORAS: "Altas horas"
};

export const SLOTS: Array<{ slot: TimeSlot; label: string }> = [
  { slot: "MANHA", label: "Manhã" },
  { slot: "TARDE", label: "Tarde" },
  { slot: "NOITE", label: "Noite" },
  { slot: "ALTAS_HORAS", label: "Altas horas" }
];

export const SLOT_SHORT: Record<TimeSlot, string> = {
  MANHA: "MANHÃ",
  TARDE: "TARDE",
  NOITE: "NOITE",
  ALTAS_HORAS: "MADRUGADA"
};

export function formatLongDate(date: string): string {
  const d = new Date(`${date}T12:00:00`);
  return d.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long"
  });
}

export function formatShortDate(date: string): string {
  const d = new Date(`${date}T12:00:00`);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

export function formatWindow(start: string, end: string): string {
  return `${formatLongDate(start)} → ${formatLongDate(end)}`;
}

/** "18:00" → "18h00" */
export function formatTime(slot: string): string {
  return /^\d{2}:\d{2}$/.test(slot) ? `${slot.replace(":", "h")}` : slot;
}

/**
 * Rótulo exibível de um slot confirmado/sugerido.
 * Modo faixa → SLOT_LABELS; modo fixo (ou valor fora do enum) → hora "18h00".
 */
export function formatSlot(slot: string | null | undefined, mode?: "FAIXA" | "FIXO"): string {
  if (!slot) return "—";
  if (mode === "FIXO" || !(slot in SLOT_LABELS)) return formatTime(slot);
  return SLOT_LABELS[slot as TimeSlot];
}