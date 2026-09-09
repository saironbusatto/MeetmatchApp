"use client";

import { useAuth } from "@/lib/auth";
import { createApiClient, ApiError } from "@/lib/client";
import { useRouter } from "next/navigation";
import { useState, type JSX } from "react";
import { T } from "@/components/ui/tokens";
import { PrimaryButton } from "@/components/ui/Button";
import { StyledInput, StyledSelect } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import type { CSSProperties } from "react";

export default function NewEventPage(): JSX.Element {
  const router = useRouter();
  const { token } = useAuth();
  const api = createApiClient(() => token);
  const [type, setType] = useState<"PRIVATE" | "PUBLIC">("PRIVATE");
  const [title, setTitle] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [capacity, setCapacity] = useState(10);
  const [quorumMin, setQuorumMin] = useState(1);
  const [admissionMode, setAdmissionMode] = useState<"FIRST_COME" | "CONFIAVEL">("FIRST_COME");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create() {
    if (!token) return;
    setLoading(true);
    setError(null);

    try {
      if (type === "PRIVATE") {
        const data = await api.privateEvents.create({ title, dateWindowStart: dateStart, dateWindowEnd: dateEnd, quorumMin });
        router.push(`/events/${data.event.id}`);
      } else {
        const data = await api.publicEvents.create({ title, eventDate, eventTime: eventTime || undefined, capacity, admissionMode });
        router.push(`/events/${data.event.id}/host`);
      }
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Não deu pra criar o evento.");
      setLoading(false);
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

  const sparkBoxStyle: CSSProperties = {
    background: T.spark + "22",
    border: `1px solid ${T.spark}`,
    borderRadius: 12,
    padding: "12px 16px",
    marginBottom: 4,
    fontFamily: T.fontBody,
    fontSize: 14,
    color: T.ink600,
    display: "flex",
    gap: 8,
    alignItems: "flex-start",
  };

  const chipsStyle: CSSProperties = {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  };

  const chipStyle = (active: boolean): CSSProperties => ({
    minWidth: 44,
    height: 44,
    padding: "0 8px",
    borderRadius: 999,
    border: `2px solid ${active ? T.vermillion : T.ink100}`,
    background: active ? T.vermillion : T.white,
    color: active ? T.white : T.ink,
    fontFamily: T.fontBody,
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
  });

  const errorStyle: CSSProperties = {
    background: T.vermillionSoft,
    border: `1px solid ${T.vermillion}`,
    borderRadius: 12,
    padding: "12px 16px",
    fontFamily: T.fontBody,
    fontSize: 14,
    color: T.vermillion,
  };

  return (
    <main style={pageStyle}>
      <h1 style={titleStyle}>Novo evento</h1>

      {error && <div style={{ ...errorStyle, marginBottom: 16 }}>{error}</div>}

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
                  A IA cruza a disponibilidade de todo mundo e sugere o melhor par
                  dia&nbsp;×&nbsp;turno dentro da janela.
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
              <div>
                <p style={sectionTitleStyle}>Quórum mínimo</p>
                <div style={chipsStyle}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setQuorumMin(n)}
                      style={chipStyle(quorumMin === n)}
                      title={`${n} pessoa(s)`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
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
              <StyledInput
                label="Horário (opcional)"
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
              />
              <StyledInput
                label="Capacidade máxima"
                type="number"
                min={1}
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                required
              />
              <StyledSelect
                label="Entrada"
                value={admissionMode}
                onChange={(e) => setAdmissionMode(e.target.value as "FIRST_COME" | "CONFIAVEL")}
              >
                <option value="FIRST_COME">Primeiro a chegar (com fila de espera)</option>
                <option value="CONFIAVEL">Quem eu confio</option>
              </StyledSelect>
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