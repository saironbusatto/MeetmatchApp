"use client";

import { useAuth } from "@/lib/auth";
import { getApiBaseUrl } from "@/lib/api";
import { useEffect, useState, useCallback } from "react";
import { T } from "@/components/ui/tokens";
import { PrimaryButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { CSSProperties, JSX } from "react";

const API = getApiBaseUrl();

type AvailResponse = "YES" | "MAYBE" | "NO";

interface DayState {
  date: string;
  response: AvailResponse;
}

function buildDayGrid(start: string, end: string): string[] {
  const days: string[] = [];
  const cur = new Date(start);
  const last = new Date(end);
  while (cur <= last) {
    days.push(cur.toISOString().split("T")[0]!);
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

const RESPONSE_CONFIG: Record<AvailResponse, { bg: string; border: string; color: string; label: string }> = {
  YES: { bg: T.successSoft, border: T.success, color: T.success, label: "Sim" },
  MAYBE: { bg: T.warnSoft, border: T.warn, color: T.warn, label: "Talvez" },
  NO: { bg: T.vermillionSoft, border: T.vermillion, color: T.vermillion, label: "Não" },
};

export default function AvailabilityPage({ params }: { params: Promise<{ id: string }> }): JSX.Element {
  const { token } = useAuth();
  const [id, setId] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [days, setDays] = useState<DayState[]>([]);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!token || !id) return;
    fetch(`${API}/private-events/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        const s: string = data.event?.settings?.dateWindowStart ?? data.settings?.dateWindowStart ?? "";
        const e: string = data.event?.settings?.dateWindowEnd ?? data.settings?.dateWindowEnd ?? "";
        if (s && e) {
          setDateStart(s);
          setDateEnd(e);
          setDays(buildDayGrid(s, e).map((d) => ({ date: d, response: "MAYBE" })));
        }
      })
      .catch(() => null);
  }, [token, id]);

  const toggle = useCallback((date: string, current: AvailResponse) => {
    const order: AvailResponse[] = ["YES", "MAYBE", "NO"];
    const next = order[(order.indexOf(current) + 1) % order.length]!;
    setDays((prev) => prev.map((d) => d.date === date ? { ...d, response: next } : d));
  }, []);

  async function save() {
    if (!token || !id) return;
    setSaving(true);
    await fetch(`${API}/private-events/${id}/availability`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ responses: days.map((d) => ({ date: d.date, response: d.response })) })
    });
    setSaving(false);
    setSaved(true);
  }

  const pageStyle: CSSProperties = {
    maxWidth: 640,
    margin: "0 auto",
    padding: "40px 24px 80px",
  };

  const titleStyle: CSSProperties = {
    fontFamily: T.fontDisplay,
    fontSize: 32,
    fontWeight: 800,
    letterSpacing: "-0.02em",
    color: T.ink,
    marginBottom: 8,
  };

  const subStyle: CSSProperties = {
    fontFamily: T.fontBody,
    fontSize: 15,
    color: T.ink500,
    marginBottom: 32,
  };

  const legendStyle: CSSProperties = {
    display: "flex",
    gap: 12,
    marginBottom: 20,
    flexWrap: "wrap",
  };

  const gridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: 8,
    marginBottom: 28,
  };

  const successBanner: CSSProperties = {
    background: T.successSoft,
    border: `1px solid ${T.success}`,
    borderRadius: 12,
    padding: "12px 16px",
    fontFamily: T.fontBody,
    fontSize: 15,
    color: T.success,
    fontWeight: 600,
    textAlign: "center",
    marginBottom: 20,
  };

  return (
    <main style={pageStyle}>
      <h1 style={titleStyle}>Disponibilidade</h1>
      <p style={subStyle}>
        Toque em cada dia pra marcar se você pode — o ciclo é Sim → Talvez → Não.
      </p>

      {saved && <div style={successBanner}>✓ Disponibilidade salva!</div>}

      <div style={legendStyle}>
        {(Object.entries(RESPONSE_CONFIG) as [AvailResponse, typeof RESPONSE_CONFIG.YES][]).map(
          ([key, cfg]) => (
            <span
              key={key}
              style={{
                padding: "4px 12px",
                borderRadius: 999,
                background: cfg.bg,
                border: `1px solid ${cfg.border}`,
                color: cfg.color,
                fontFamily: T.fontBody,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {cfg.label}
            </span>
          )
        )}
      </div>

      {days.length > 0 ? (
        <Card noShadow>
          <div style={gridStyle}>
            {days.map(({ date, response }) => {
              const cfg = RESPONSE_CONFIG[response];
              const d = new Date(date + "T12:00:00");
              return (
                <button
                  key={date}
                  onClick={() => toggle(date, response)}
                  title={date}
                  style={{
                    padding: "10px 4px",
                    borderRadius: 12,
                    background: cfg.bg,
                    border: `2px solid ${cfg.border}`,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <span
                    style={{
                      fontFamily: T.fontBody,
                      fontSize: 10,
                      fontWeight: 600,
                      color: cfg.color,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {d.toLocaleDateString("pt-BR", { weekday: "short" })}
                  </span>
                  <span
                    style={{
                      fontFamily: T.fontMono,
                      fontSize: 15,
                      fontWeight: 700,
                      color: cfg.color,
                    }}
                  >
                    {d.getDate()}
                  </span>
                </button>
              );
            })}
          </div>
          <PrimaryButton onClick={save} disabled={saving} fullWidth>
            {saving ? "Salvando..." : "Salvar disponibilidade"}
          </PrimaryButton>
        </Card>
      ) : (
        <Card noShadow>
          <p style={{ fontFamily: T.fontBody, color: T.ink400, textAlign: "center", padding: "20px 0" }}>
            Carregando janela de datas…
          </p>
        </Card>
      )}
    </main>
  );
}
