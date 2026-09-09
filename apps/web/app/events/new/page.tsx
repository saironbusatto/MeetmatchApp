"use client";

import { useAuth } from "@/lib/auth";
import { createApiClient, ApiError } from "@/lib/client";
import { useRouter } from "next/navigation";
import { useState, type JSX } from "react";
import type { TimeSlot, MatchingMode } from "@farmei/types";
import { SLOTS } from "@/lib/dates";
import { T } from "@/components/ui/tokens";
import { PrimaryButton } from "@/components/ui/Button";
import { StyledInput, StyledSelect } from "@/components/ui/Input";
import { QuorumStepper } from "@/components/ui/QuorumStepper";
import { Card } from "@/components/ui/Card";
import type { CSSProperties } from "react";

type Choice = "PRIVATE" | "PUBLIC";

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export default function NewEventPage(): JSX.Element {
  const router = useRouter();
  const { token } = useAuth();
  const api = createApiClient(() => token);
  const [type, setType] = useState<Choice>("PRIVATE");
  const [title, setTitle] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventSlot, setEventSlot] = useState<TimeSlot | "">("");
  const [capacity, setCapacity] = useState(10);
  const [quorumMin, setQuorumMin] = useState(1);
  const [matchingMode, setMatchingMode] = useState<MatchingMode>("FAIXA");
  const [fixedSlotsInput, setFixedSlotsInput] = useState("");
  const [admissionMode, setAdmissionMode] = useState<"FIRST_COME" | "CONFIAVEL">("FIRST_COME");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create() {
    if (!token) return;
    setLoading(true);
    setError(null);

    try {
      if (type === "PRIVATE") {
        if (matchingMode === "FIXO") {
          const slots = fixedSlotsInput.split(",").map((s) => s.trim()).filter(Boolean);
          if (slots.length === 0) {
            setError("Digita ao menos um horário candidato (ex: 18:00, 20:00).");
            setLoading(false);
            return;
          }
          if (!slots.every((s) => TIME_RE.test(s))) {
            setError("Horários precisam ser HH:MM (24h), separados por vírgula — ex: 18:00, 20:00.");
            setLoading(false);
            return;
          }
          const data = await api.privateEvents.create({ title, dateWindowStart: dateStart, dateWindowEnd: dateEnd, quorumMin, matchingMode: "FIXO", fixedSlots: slots });
          router.push(`/events/${data.event.id}`);
          return;
        }
        const data = await api.privateEvents.create({ title, dateWindowStart: dateStart, dateWindowEnd: dateEnd, quorumMin, matchingMode: "FAIXA" });
        router.push(`/events/${data.event.id}`);
      } else {
        if (!eventDate) {
          setError("Escolhe a data do evento (é obrigatória).");
          setLoading(false);
          return;
        }
        const data = await api.publicEvents.create({ title, eventDate, eventSlot: eventSlot || undefined, capacity, admissionMode });
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

  const errorStyle: CSSProperties = {
    background: T.vermillionSoft,
    border: `1px solid ${T.vermillion}`,
    borderRadius: 12,
    padding: "12px 16px",
    fontFamily: T.fontBody,
    fontSize: 14,
    color: T.vermillion,
  };

  const chipsStyle: CSSProperties = {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  };

  const chipStyle = (active: boolean): CSSProperties => ({
    minWidth: 44,
    height: 44,
    padding: "0 14px",
    borderRadius: 999,
    border: `2px solid ${active ? T.vermillion : T.ink100}`,
    background: active ? T.vermillion : T.white,
    color: active ? T.white : T.ink,
    fontFamily: T.fontBody,
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
  });

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
            <option value="PRIVATE">Privado (a melhor data pra todo mundo)</option>
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
                  {matchingMode === "FAIXA"
                    ? "O sistema cruza a disponibilidade de todo mundo e sugere o melhor par dia × turno dentro da janela."
                    : "Você define os horários candidatos e o sistema cruza a disponibilidade de todo mundo pra cada hora."}
                </span>
              </div>
              <p style={sectionTitleStyle}>Como a gente combina?</p>
              <div style={chipsStyle}>
                <button type="button" onClick={() => setMatchingMode("FAIXA")} style={chipStyle(matchingMode === "FAIXA")}>
                  Por faixa
                </button>
                <button type="button" onClick={() => setMatchingMode("FIXO")} style={chipStyle(matchingMode === "FIXO")}>
                  Horário fixo
                </button>
              </div>
              {matchingMode === "FIXO" && (
                <StyledInput
                  label="Horários candidatos"
                  placeholder="Ex: 18:00, 20:00, 22:00"
                  value={fixedSlotsInput}
                  onChange={(e) => setFixedSlotsInput(e.target.value)}
                />
              )}
              <p style={sectionTitleStyle}>Janela de datas</p>
              <StyledInput
                label="Data início"
                type="date"
                value={dateStart}
                onChange={(e) => {
                  const start = e.target.value;
                  setDateStart(start);
                  if (!start) return;
                  const next = new Date(`${start}T00:00:00Z`);
                  next.setUTCDate(next.getUTCDate() + 30);
                  const suggested = next.toISOString().slice(0, 10);
                  if (!dateEnd || dateEnd < start) {
                    setDateEnd(suggested);
                  }
                }}
                required
              />
              <StyledInput
                label="Data fim"
                type="date"
                value={dateEnd}
                onChange={(e) => setDateEnd(e.target.value)}
                required
              />
              <p style={{ fontFamily: T.fontBody, fontSize: 12, color: T.ink400, margin: "-12px 0 0" }}>
                Sugerimos 30 dias de janela — dá pra ajustar.
              </p>
              <div>
                <p style={sectionTitleStyle}>Quórum mínimo</p>
                <p style={{ fontFamily: T.fontBody, fontSize: 13, color: T.ink500, margin: "0 0 10px" }}>
                  Quantas pessoas precisam poder ir pra fechar? Segure o botão pra mudar rápido.
                </p>
                <QuorumStepper value={quorumMin} onChange={setQuorumMin} />
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
              <StyledSelect
                label="Faixa (opcional)"
                value={eventSlot}
                onChange={(e) => setEventSlot(e.target.value as TimeSlot | "")}
              >
                <option value="">Sem faixa</option>
                {SLOTS.map((s) => (
                  <option key={s.slot} value={s.slot}>{s.label}</option>
                ))}
              </StyledSelect>
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