"use client";

import { useApiToken } from "@/hooks/useApiToken";
import { getApiBaseUrl } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { T } from "@/components/ui/tokens";
import { PrimaryButton } from "@/components/ui/Button";
import { StyledInput, StyledSelect } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import type { CSSProperties, JSX } from "react";

const API = getApiBaseUrl();

export default function NewEventPage(): JSX.Element {
  const router = useRouter();
  const getToken = useApiToken();
  const [type, setType] = useState<"PRIVATE" | "PUBLIC">("PRIVATE");
  const [title, setTitle] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [capacity, setCapacity] = useState(10);
  const [loading, setLoading] = useState(false);

  async function create() {
    const token = await getToken();
    if (!token) return;
    setLoading(true);

    if (type === "PRIVATE") {
      const res = await fetch(`${API}/private-events`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, dateWindowStart: dateStart, dateWindowEnd: dateEnd })
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok) router.push(`/events/${data.event.id}`);
    } else {
      const res = await fetch(`${API}/public-events`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, eventDate, capacity })
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok) router.push(`/events/${data.event.id}/host`);
    }
  }

  const pageStyle: CSSProperties = {
    maxWidth: 560,
    margin: "0 auto",
    padding: "40px 24px 80px",
  };

  const titleStyle: CSSProperties = {
    fontFamily: T.fontDisplay,
    fontSize: 36,
    fontWeight: 800,
    letterSpacing: "-0.02em",
    color: T.ink,
    marginBottom: 32,
  };

  const sectionTitleStyle: CSSProperties = {
    fontFamily: T.fontDisplay,
    fontSize: 16,
    fontWeight: 700,
    color: T.ink,
    margin: "24px 0 12px",
  };

  const hintStyle: CSSProperties = {
    fontFamily: T.fontBody,
    fontSize: 13,
    color: T.ink400,
    marginTop: 6,
  };

  const sparkBoxStyle: CSSProperties = {
    background: T.spark + "22",
    border: `1px solid ${T.spark}`,
    borderRadius: 12,
    padding: "12px 16px",
    marginBottom: 20,
    fontFamily: T.fontBody,
    fontSize: 14,
    color: T.ink600,
    display: "flex",
    gap: 8,
    alignItems: "flex-start",
  };

  return (
    <main style={pageStyle}>
      <h1 style={titleStyle}>Novo evento</h1>

      <Card>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <StyledSelect
            label="Tipo de evento"
            value={type}
            onChange={(e) => setType(e.target.value as "PRIVATE" | "PUBLIC")}
          >
            <option value="PRIVATE">Privado (IA escolhe a melhor data)</option>
            <option value="PUBLIC">Público (data fixa, inscrições abertas)</option>
          </StyledSelect>

          <StyledInput
            label="Título"
            placeholder={type === "PRIVATE" ? "Ex: Almoço de planejamento Q3" : "Ex: Futebol de salão — sábado"}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          {type === "PRIVATE" ? (
            <>
              <div style={sparkBoxStyle}>
                <span>✨</span>
                <span>
                  A IA vai cruzar a disponibilidade de todos os participantes e sugerir
                  a melhor data dentro da janela que você definir.
                </span>
              </div>
              <p style={sectionTitleStyle}>Janela de datas</p>
              <StyledInput
                label="Data início"
                type="date"
                value={dateStart}
                onChange={(e) => setDateStart(e.target.value)}
                required
              />
              <StyledInput
                label="Data fim"
                type="date"
                value={dateEnd}
                onChange={(e) => setDateEnd(e.target.value)}
                required
              />
            </>
          ) : (
            <>
              <StyledInput
                label="Data do evento"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
              />
              <div>
                <StyledInput
                  label="Capacidade máxima"
                  type="number"
                  min={1}
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  required
                />
                <p style={hintStyle}>Número máximo de inscrições aceitas.</p>
              </div>
            </>
          )}

          <PrimaryButton onClick={create} disabled={loading} fullWidth>
            {loading ? "Criando..." : "Criar evento"}
          </PrimaryButton>
        </div>
      </Card>
    </main>
  );
}
