import type { TimeSlot } from "@farmei/types";

export const SLOT_LABELS: Record<TimeSlot, string> = {
  MANHA: "Manhã",
  TARDE: "Tarde",
  NOITE: "Noite",
  ALTAS_HORAS: "Altas horas",
};

export function formatSlot(slot: string | null | undefined): string {
  if (!slot) return "—";
  if (slot in SLOT_LABELS) return SLOT_LABELS[slot as TimeSlot];
  if (/^\d{2}:\d{2}$/.test(slot)) return slot.replace(":", "h");
  return slot;
}

export const SLOTS: TimeSlot[] = ["MANHA", "TARDE", "NOITE", "ALTAS_HORAS"];

export function formatLongDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}

export function formatWindow(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}

export interface GridDay {
  date: string;
  weekday: string;
  dayNumber: number;
}

export function daysInWindow(start: string, end: string, max = 28): GridDay[] {
  const days: GridDay[] = [];
  const cur = new Date(start);
  const last = new Date(end);
  const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  while (cur <= last && days.length < max) {
    days.push({
      date: cur.toISOString().split("T")[0],
      weekday: WEEKDAYS[cur.getDay()],
      dayNumber: cur.getDate(),
    });
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}