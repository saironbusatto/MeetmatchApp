"use client";

import { useAuth } from "@/lib/auth";
import { createApiClient, ApiError } from "@/lib/client";
import Link from "next/link";
import { useEffect, useRef, useState, type JSX } from "react";
import { T } from "@/components/ui/tokens";
import { PrimaryButton, SecondaryButton, GhostButton } from "@/components/ui/Button";
import { QuorumStepper } from "@/components/ui/QuorumStepper";
import { Card } from "@/components/ui/Card";
import { formatLongDate, formatSlot } from "@/lib/dates";
import type { CSSProperties } from "react";
import type { PrivateEventDetail, SlotSuggestion } from "@farmei/types";

type StatusKey = "PENDING" | "CONFIRMED" | "NO_DATE" | "CANCELLED";
interface StatusCfg {
  label: string;
  color: string;
  bg: string;
}

const STATUS_LABEL: Record<StatusKey, StatusCfg> = {
  PENDING: { label: "Aguardando data", color: T.warn, bg: T.warnSoft },
  CONFIRMED: { label: "Confirmado", color: T.success, bg: T.successSoft },
  NO_DATE: { label: "Sem data ainda", color: T.ink500, bg: T.ink100 },
  CANCELLED: { label: "Cancelado", color: T.vermillion, bg: T.vermillionSoft },
};

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }): JSX.Element | null {
  const { user, token } = useAuth();
  const api = createApiClient(() => token);
  const [id, setId] = useState("");
  const [detail, setDetail] = useState<PrivateEventDetail | null>(null);
  const [suggestion, setSuggestion] = useState<SlotSuggestion | null>(null);
  const [keyPersonBlocking, setKeyPersonBlocking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [quorumDraft, setQuorumDraft] = useState(1);
  const quorumDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (detail?.settings?.quorumMin != null) setQuorumDraft(detail.settings.quorumMin);
  }, [detail?.settings?.quorumMin]);

  useEffect(() => {
    if (quorumDebounce.current !== null) clearTimeout(quorumDebounce.current);
    if (!detail?.settings || quorumDraft === detail.settings.quorumMin) return;
    quorumDebounce.current = setTimeout(() => {
      saveConfig({ quorumMin: quorumDraft });
    }, 550);
  }, [quorumDraft]);

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  async function refresh() {
    if (!token || !id) return;
    try {
      const res = await api.privateEvents.get(id);
      setDetail(res);
      setError(null);
      try {
        const sug = await api.privateEvents.suggestion(id);
        setSuggestion(sug.suggestion);
        setKeyPersonBlocking(sug.keyPersonBlocking);
      } catch {
        setSuggestion(null);
      }
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Não deu pra carregar o evento.");
    }
  }

  useEffect(() => {
    refresh();
  }, [token, id]);

  async function saveConfig(patch: { keyPersonUserId?: string | null; quorumMin?: number }) {
    if (!token || !id) return;
    setSaving(true);
    try {
      await api.privateEvents.update(id, patch);
      await refresh();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Não deu pra salvar.");
    } finally {
      setSaving(false);
    }
  }

  async function confirm() {
    if (!token || !id) return;
    try {
      await api.privateEvents.confirm(id);
      await refresh();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Ainda não dá pra confirmar.");
    }
  }

  async function leaveBolo() {
    if (!token || !id) return;
    try {
      await api.privateEvents.diaDoBolo(id, "leave");
      await refresh();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Não deu pra sair.");
    }
  }

  if (!id || !token) return null;

  const event = detail?.event;
  const settings = detail?.settings;
  const status = event?.status ?? null;
  const statusCfg: StatusCfg = STATUS_LABEL[(status ?? "PENDING") as StatusKey] ?? STATUS_LABEL.PENDING;
  const owner = (detail?.participants ?? []).find((p) => p.role === "OWNER");
  const isOwner = user?.id && owner?.userId === user.id;
  const myParticipation = (detail?.participants ?? []).find((p) => p.userId === user?.id);
  const candidates = (detail?.participants ?? []).filter((p) => p.role !== "OWNER" && p.userId && p.inviteStatus === "ACCEPTED");
  const isConfirmed = status === "CONFIRMED";
  const windowOpen =
    isConfirmed &&
    !!event?.confirmationWindowEndsAt &&
    new Date(event.confirmationWindowEndsAt).getTime() > Date.now();

  const pageStyle: CSSProperties = { maxWidth: 680, margin: "0 auto", padding: "40px 24px 80px" };
  const titleStyle: CSSProperties = { fontFamily: T.fontDisplay, fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em", color: T.ink, marginBottom: 8 };
  const sectionTitleStyle: CSSProperties = { fontFamily: T.fontDisplay, fontSize: 16, fontWeight: 700, color: T.ink, margin: "28px 0 12px" };
  const hintStyle: CSSProperties = { fontFamily: T.fontBody, fontSize: 13, color: T.ink400, marginTop: 8 };
  const sparkBoxStyle: CSSProperties = { background: T.spark + "22", border: `1px solid ${T.spark}`, borderRadius: 12, padding: "12px 16px", marginBottom: 4, fontFamily: T.fontBody, fontSize: 14, color: T.ink600, display: "flex", gap: 8, alignItems: "flex-start" };
  const errorBoxStyle: CSSProperties = { background: T.vermillionSoft, border: `1px solid ${T.vermillion}`, borderRadius: 12, padding: "12px 16px", fontFamily: T.fontBody, fontSize: 14, color: T.vermillion, marginBottom: 16 };
  const chipsStyle: CSSProperties = { display: "flex", gap: 8, flexWrap: "wrap" };
  const chipStyle = (active: boolean): CSSProperties => ({ minWidth: 44, height: 44, padding: "0 8px", borderRadius: 999, border: `2px solid ${active ? T.vermillion : T.ink100}`, background: active ? T.vermillion : T.white, color: active ? T.white : T.ink, fontFamily: T.fontBody, fontSize: 16, fontWeight: 700, cursor: "pointer" });
  const participantRow: CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${T.ink50}`, fontFamily: T.fontBody, fontSize: 15, color: T.ink };
  const pill = (bg: string, color: string): CSSProperties => ({ padding: "3px 10px", borderRadius: 999, fontFamily: T.fontBody, fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", background: bg, color, border: `1px solid ${color}` });

  return (
    <main style={pageStyle}>
      {error && <div style={errorBoxStyle}>{error}</div>}

      {!detail ? (
        <Card noShadow>
          <p style={{ fontFamily: T.fontBody, color: T.ink400, textAlign: "center", padding: "20px 0" }}>Carregando…</p>
        </Card>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
            <h1 style={titleStyle}>{event?.title ?? "Evento"}</h1>
            {status && <span style={pill(statusCfg.bg, statusCfg.color)}>{statusCfg.label}</span>}
          </div>

          {isConfirmed && event?.confirmedDate && (
            <div style={sparkBoxStyle}>
              <span>🎉</span>
              <span>
                Fechou: <strong>{formatLongDate(event.confirmedDate)}</strong> de{" "}
                <strong>{formatSlot(event.confirmedSlot, settings?.matchingMode)}</strong>.
                Cruzamos a disponibilidade de todo mundo.
              </span>
            </div>
          )}

          {isConfirmed && windowOpen && myParticipation && (
            <div style={{ margin: "16px 0", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontFamily: T.fontBody, fontSize: 14, color: T.ink500 }}>
                Janela de re-match aberta por 24h após confirmar ⏳
              </span>
              <GhostButton onClick={leaveBolo} disabled={saving}>
                Não vou mais!
              </GhostButton>
            </div>
          )}

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", margin: "20px 0" }}>
            {myParticipation ? (
              <Link href={`/events/${id}/availability`}>
                <PrimaryButton>Marcar minha disponibilidade</PrimaryButton>
              </Link>
            ) : (
              <span style={{ fontFamily: T.fontBody, fontSize: 14, color: T.ink400 }}>Você ainda não participa deste evento.</span>
            )}
            {isOwner && (
              <SecondaryButton
                onClick={async () => {
                  const email = prompt("Email do convidado:");
                  if (!email?.trim() || !email.includes("@")) return;
                  setSaving(true);
                  try {
                    const res = await api.privateEvents.invite(id, { email: email.trim() });
                    navigator.clipboard?.writeText(res.inviteLink);
                    alert("Link de convite copiado! Mande pra " + email.trim());
                  } catch (e) {
                    setError(e instanceof ApiError ? e.message : "Não deu pra criar o convite.");
                  } finally {
                    setSaving(false);
                  }
                }}
                disabled={saving}
              >
                Convidar
              </SecondaryButton>
            )}
          </div>

          {settings && (
            <Card>
              <p style={{ ...sectionTitleStyle, marginTop: 0 }}>Janela de datas</p>
              <p style={{ fontFamily: T.fontBody, fontSize: 15, color: T.ink500 }}>
                {formatLongDate(settings.dateWindowStart)} → {formatLongDate(settings.dateWindowEnd)}
              </p>
              <p style={{ fontFamily: T.fontBody, fontSize: 15, color: T.ink500, marginTop: 4 }}>
                Quórum mínimo: <strong>{settings.quorumMin}</strong>{" "}
                {settings.keyPersonUserId ? "· pessoa-chave definida" : "· sem pessoa-chave"}
              </p>
              {settings.matchingMode === "FIXO" && (
                <p style={{ fontFamily: T.fontBody, fontSize: 15, color: T.ink500, marginTop: 4 }}>
                  Horários: <strong>{(settings.fixedSlots ?? []).map((t) => formatSlot(t, "FIXO")).join(" · ")}</strong>
                </p>
              )}
            </Card>
          )}

          {isOwner && (
            <div style={{ marginTop: 12 }}>
              <div style={sparkBoxStyle}>
                <span>✦</span>
                <span>A melhor data pra todo mundo — a sugestão dá peso extra pra pessoa-chave e só fecha com o quórum.</span>
              </div>
              <Card noShadow>
                <p style={sectionTitleStyle}>Quórum mínimo</p>
                <p style={{ fontFamily: T.fontBody, fontSize: 13, color: T.ink500, margin: "0 0 10px" }}>
                  Quantas pessoas precisam poder ir pra fechar? Segure o botão pra mudar rápido.
                </p>
                <QuorumStepper
                  value={quorumDraft}
                  onChange={setQuorumDraft}
                  disabled={saving}
                />
                <p style={sectionTitleStyle}>Pessoa-chave</p>
                <div style={chipsStyle}>
                  <button
                    type="button"
                    onClick={() => saveConfig({ keyPersonUserId: null })}
                    disabled={saving}
                    style={chipStyle(
                      settings?.keyPersonUserId === null || !settings?.keyPersonUserId
                    )}
                  >
                    Ninguém
                  </button>
                  {candidates.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => saveConfig({ keyPersonUserId: p.userId! })}
                      disabled={saving}
                      style={chipStyle(settings?.keyPersonUserId === p.userId)}
                    >
                      {p.nameSnapshot ?? p.email ?? "Convidado"}
                    </button>
                  ))}
                </div>
              </Card>

              <div style={{ marginTop: 16 }}>
                <p style={sectionTitleStyle}>Sugestão de data</p>
                {suggestion ? (
                  <Card noShadow>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                      <div>
                        <p style={{ fontFamily: T.fontBody, fontSize: 16, fontWeight: 700, color: T.ink, margin: 0 }}>
                          {formatLongDate(suggestion.date)} · {formatSlot(suggestion.slot, settings?.matchingMode)}
                        </p>
                        <p style={{ fontFamily: T.fontBody, fontSize: 14, color: T.ink500, margin: "6px 0 0" }}>
                          {suggestion.yesCount} confirmados ·{" "}
                          {suggestion.quorumMet ? "quórum atingido ✓" : `falta pro quórum de ${settings?.quorumMin}`}
                        </p>
                      </div>
                      <span style={{ fontFamily: T.fontMono, fontSize: 13, fontWeight: 700, color: T.vermillion }}>
                        {Math.round(suggestion.confidence * 100)}%
                      </span>
                    </div>
                    <p style={{ ...sparkBoxStyle, marginTop: 12 }}>🧠 {suggestion.reasoning}</p>
                    {keyPersonBlocking && (
                      <p style={{ ...hintStyle, color: T.warn, fontWeight: 600 }}>
                        Esperando a pessoa-chave responder — a sugestão não fecha sem ela.
                      </p>
                    )}
                    <div style={{ marginTop: 16 }}>
                      <PrimaryButton onClick={confirm} disabled={saving} fullWidth>
                        {saving ? "Confirmando…" : isConfirmed ? "Já confirmado" : "Confirmar essa data"}
                      </PrimaryButton>
                    </div>
                  </Card>
                ) : (
                  <Card noShadow>
                    <p style={{ fontFamily: T.fontBody, color: T.ink400, textAlign: "center", padding: "8px 0" }}>
                      Ainda não dá pra sugerir — falta disponibilidade dos participantes.
                    </p>
                  </Card>
                )}
              </div>
            </div>
          )}

          <p style={sectionTitleStyle}>Participantes</p>
          <Card noShadow>
            {(detail.participants ?? []).map((p) => (
              <div key={p.id} style={participantRow}>
                <span>{p.nameSnapshot ?? p.email ?? "Convidado"}</span>
                <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {p.role === "KEY_PERSON" && <span style={pill(T.spark + "33", T.ink)}>· chave</span>}
                  <span style={pill(T.ink100, T.ink500)}>{p.inviteStatus}</span>
                </span>
              </div>
            ))}
          </Card>

          <p style={hintStyle}>Confiança acima de 100% = dias com indicação de quem não conhece o grupo.</p>
        </>
      )}
    </main>
  );
}