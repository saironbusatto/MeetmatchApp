"use client";

import { useAuth } from "@/lib/auth";
import { createApiClient, ApiError } from "@/lib/client";
import { useEffect, useState, useCallback, Fragment, type JSX } from "react";
import { T } from "@/components/ui/tokens";
import { PrimaryButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SLOTS, SLOT_SHORT, formatShortDate } from "@/lib/dates";
import type { CSSProperties } from "react";
import { AvailabilityChoice } from "@farmei/types";
import type { PrivateEventDetail, TimeSlot } from "@farmei/types";

function buildDays(start: string, end: string): string[] {
  const days: string[] = [];
  const cur = new Date(`${start}T12:00:00`);
  const last = new Date(`${end}T12:00:00`);
  while (cur <= last) {
    days.push(cur.toISOString().split("T")[0]!);
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

type Choice = AvailabilityChoice | null;

const CHOICE_STYLE: Record<AvailabilityChoice, { bg: string; border: string; color: string }> = {
  YES: { bg: T.successSoft, border: T.success, color: T.success },
  MAYBE: { bg: T.warnSoft, border: T.warn, color: T.warn },
  NO: { bg: T.vermillionSoft, border: T.vermillion, color: T.vermillion },
};

const CHOICE_LABEL: Record<AvailabilityChoice, string> = {
  YES: "Sim",
  MAYBE: "Talvez",
  NO: "Não",
};

const CYCLE: AvailabilityChoice[] = [AvailabilityChoice.YES, AvailabilityChoice.MAYBE, AvailabilityChoice.NO];

export default function AvailabilityPage({ params }: { params: Promise<{ id: string }> }): JSX.Element {
  const { user, token } = useAuth();
  const api = createApiClient(() => token);
  const [id, setId] = useState("");
  const [detail, setDetail] = useState<PrivateEventDetail | null>(null);
  const [days, setDays] = useState<string[]>([]);
  const [marks, setMarks] = useState<Record<string, Choice>>({});
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!token || !id) return;
    (async () => {
      try {
        const res = await api.privateEvents.get(id);
        setDetail(res);
        const start = res.settings.dateWindowStart;
        const end = res.settings.dateWindowEnd;
        setDays(buildDays(start, end));
        const me = res.participants.find((p) => p.userId === user?.id);
        if (me) {
          try {
            const av = await api.privateEvents.availability(id);
            const next: Record<string, Choice> = {};
            av.availability
              .filter((a) => a.participantId === me.id)
              .forEach((a) => {
                next[`${a.date}|${a.slot}`] = a.response;
              });
            setMarks(next);
          } catch {
            setMarks({});
          }
        }
      } catch (e) {
        setError(e instanceof ApiError ? e.message : "Não deu pra carregar o evento.");
      }
    })();
  }, [token, id]);

  const toggle = useCallback((date: string, slotKey: string) => {
    const key = `${date}|${slotKey}`;
    setMarks((prev) => {
      const current = prev[key];
      const currentIndex = current == null ? -1 : CYCLE.indexOf(current);
      const nextChoice: Choice = currentIndex === -1 || currentIndex === CYCLE.length - 1 ? CYCLE[0]! : CYCLE[currentIndex + 1]!;
      return { ...prev, [key]: nextChoice };
    });
  }, []);

  async function save() {
    if (!token || !id) return;
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const responses = Object.entries(marks)
        .filter(([, choice]) => choice !== null)
        .map(([key, choice]) => {
          const [date, slot] = key.split("|");
          return { date: date!, slot: slot as TimeSlot, response: (choice ?? "YES") as AvailabilityChoice };
        });
      if (responses.length === 0) {
        setError("Marca pelo menos um dia e turno que você consiga.");
        setSaving(false);
        return;
      }
      await api.privateEvents.submitAvailability(id, { responses });
      setSaved(true);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Não deu pra salvar.");
    } finally {
      setSaving(false);
    }
  }

  const markedCount = Object.values(marks).filter((c) => c !== null).length;

  const pageStyle: CSSProperties = { maxWidth: 900, margin: "0 auto", padding: "40px 24px 80px" };
  const titleStyle: CSSProperties = { fontFamily: T.fontDisplay, fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em", color: T.ink, marginBottom: 8 };
  const subStyle: CSSProperties = { fontFamily: T.fontBody, fontSize: 15, color: T.ink500, marginBottom: 28 };
  const legendItem: CSSProperties = { padding: "4px 12px", borderRadius: 999, fontFamily: T.fontBody, fontSize: 13, fontWeight: 600 };
  const errorBoxStyle: CSSProperties = { background: T.vermillionSoft, border: `1px solid ${T.vermillion}`, borderRadius: 12, padding: "12px 16px", fontFamily: T.fontBody, fontSize: 14, color: T.vermillion, marginBottom: 16 };
  const successBoxStyle: CSSProperties = { background: T.successSoft, border: `1px solid ${T.success}`, borderRadius: 12, padding: "12px 16px", fontFamily: T.fontBody, fontSize: 15, color: T.success, fontWeight: 600, textAlign: "center", marginBottom: 20 };

  return (
    <main style={pageStyle}>
      <h1 style={titleStyle}>Disponibilidade</h1>
      <p style={subStyle}>
        Clica em cada <strong>dia × turno</strong> pra marcar se você consegue. O ciclo é Sim → Talvez → Não.
      </p>

      {error && <div style={errorBoxStyle}>{error}</div>}
      {saved && <div style={successBoxStyle}>✓ Disponibilidade salva!</div>}

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
        {(Object.entries(CHOICE_STYLE) as [AvailabilityChoice, (typeof CHOICE_STYLE)["YES"]][]).map(([choice, cfg]) => (
          <span key={choice} style={{ ...legendItem, background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}>
            {CHOICE_LABEL[choice]}
          </span>
        ))}
        <span style={{ ...legendItem, background: T.ink50, border: `1px solid ${T.ink100}`, color: T.ink400 }}>
          Repete pra limpar
        </span>
      </div>

      {days.length === 0 ? (
        <Card noShadow>
          <p style={{ fontFamily: T.fontBody, color: T.ink400, textAlign: "center", padding: "20px 0" }}>
            Carregando janela de datas… ({detail?.settings?.dateWindowStart ?? "…"} → {detail?.settings?.dateWindowEnd ?? "…"})
          </p>
        </Card>
      ) : (
        <Card noShadow>
          <div style={{ overflowX: "auto" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `120px repeat(${SLOTS.length}, minmax(110px, 1fr))`,
                gap: 6,
                minWidth: 560,
              }}
            >
              <div />
              {SLOTS.map(({ slot }) => (
                <div key={slot} style={{ fontFamily: T.fontMono, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: T.ink400, textAlign: "center", textTransform: "uppercase", padding: "8px 0 12px" }}>
                  {SLOT_SHORT[slot]}
                </div>
              ))}
              {days.map((date) => {
                const d = new Date(`${date}T12:00:00`);
                const short = d.toLocaleDateString("pt-BR", { weekday: "short" });
                return (
                  <Fragment key={date}>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 4px", fontFamily: T.fontBody, fontSize: 13, color: T.ink600 }}>
                      <span style={{ fontWeight: 700 }}>{short}</span>
                      <span style={{ fontFamily: T.fontMono, color: T.ink400, fontSize: 12 }}>
                        {formatShortDate(date)}
                      </span>
                    </div>
                    {SLOTS.map(({ slot }) => {
                      const choice = marks[`${date}|${slot}`] ?? null;
                      const cfg = choice ? CHOICE_STYLE[choice] : null;
                      return (
                        <button
                          key={`${date}-${slot}`}
                          onClick={() => toggle(date, slot)}
                          title={`${short} ${formatShortDate(date)} — ${SLOT_SHORT[slot]}`}
                          style={{
                            aspectRatio: "1.35",
                            borderRadius: 10,
                            border: `2px solid ${cfg ? cfg.border : T.ink100}`,
                            background: cfg ? cfg.bg : T.white,
                            color: cfg ? cfg.color : T.ink400,
                            cursor: "pointer",
                            fontFamily: T.fontBody,
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          {choice ? CHOICE_LABEL[choice] : "+"}
                        </button>
                      );
                    })}
                  </Fragment>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <PrimaryButton onClick={save} disabled={saving} fullWidth>
              {saving ? "Salvando..." : `Salvar disponibilidade${markedCount > 0 ? ` (${markedCount})` : ""}`}
            </PrimaryButton>
            <p style={{ fontFamily: T.fontBody, fontSize: 13, color: T.ink400, marginTop: 10, textAlign: "center" }}>
              Deixa em branco o que você não marcou — a IA só considera o que você confirmou.
            </p>
          </div>
        </Card>
      )}
    </main>
  );
}