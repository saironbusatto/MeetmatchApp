"use client";

import { useAuth } from "@/lib/auth";
import { createApiClient } from "@/lib/client";
import { useEffect, useState } from "react";
import { T } from "@/components/ui/tokens";
import { PrimaryButton, GhostButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { CSSProperties, JSX } from "react";
import type { Event, PublicEventSettings } from "@farmei/types";

interface PublicEventItem {
  id: string;
  detail: {
    event: Event;
    settings: PublicEventSettings;
  };
}

type MyState = { eventId: string; status: "REGISTERED" | "WAITLIST" | null; position?: number | null };

export default function PublicPage(): JSX.Element {
  const { token } = useAuth();
  const api = createApiClient(() => token);
  const [events, setEvents] = useState<PublicEventItem[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [myEvents, setMyEvents] = useState<Record<string, MyState>>({});

  useEffect(() => {
    if (!token) return;
    api.publicEvents
      .list()
      .then((data) => setEvents(data.data.map((d) => ({ id: d.event.id, detail: { event: d.event, settings: d.settings as PublicEventSettings } }))))
      .catch(() => null);
  }, [token]);

  async function register(eventId: string) {
    if (!token) return;
    setBusy(eventId);
    try {
      const res = await api.publicEvents.register(eventId);
      setMyEvents((prev) => ({
        ...prev,
        [eventId]: {
          eventId,
          status: res.registration.status,
          position: res.registration.position ?? null,
        },
      }));
    } catch {
      setMyEvents((prev) => ({ ...prev, [eventId]: { eventId, status: null } }));
    } finally {
      setBusy(null);
    }
  }

  async function unregister(eventId: string) {
    if (!token) return;
    setBusy(eventId);
    try {
      await api.publicEvents.unregister(eventId);
      setMyEvents((prev) => ({ ...prev, [eventId]: { eventId, status: null } }));
    } finally {
      setBusy(null);
    }
  }

  const pageStyle: CSSProperties = { maxWidth: 1024, margin: "0 auto", padding: "40px 24px 80px" };
  const titleStyle: CSSProperties = { fontFamily: T.fontDisplay, fontSize: 36, fontWeight: 800, letterSpacing: "-0.02em", color: T.ink, margin: 0 };
  const eyebrowStyle: CSSProperties = { fontFamily: T.fontBody, fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: T.vermillion, marginBottom: 8 };
  const gridStyle: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 };
  const emptyStyle: CSSProperties = { fontFamily: T.fontBody, fontSize: 16, color: T.ink400, padding: "60px 0", textAlign: "center" };

  return (
    <main style={pageStyle}>
      <div style={{ marginBottom: 40 }}>
        <p style={eyebrowStyle}>Feed aberto</p>
        <h1 style={titleStyle}>Eventos públicos</h1>
      </div>

      {events.length === 0 ? (
        <div style={emptyStyle}>Nenhum evento público disponível no momento.</div>
      ) : (
        <div style={gridStyle}>
          {events.map(({ id, detail }) => {
            const ev = detail.event;
            const settings = detail.settings;
            const my = myEvents[id]?.status;
            const capacity = settings.capacity ?? 0;

            return (
              <Card key={id} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {settings.eventDate && (
                  <div style={{ fontFamily: T.fontMono, fontSize: 12, color: T.ink400, letterSpacing: "0.04em" }}>
                    {new Date(settings.eventDate + "T12:00:00").toLocaleDateString("pt-BR", {
                      weekday: "long",
                      day: "2-digit",
                      month: "long",
                    })}
                  </div>
                )}

                <h3 style={{ fontFamily: T.fontDisplay, fontSize: 20, fontWeight: 700, color: T.ink, margin: 0 }}>
                  {ev.title}
                </h3>

                {ev.description && (
                  <p style={{ fontFamily: T.fontBody, fontSize: 14, color: T.ink500, margin: 0, lineHeight: 1.5 }}>
                    {ev.description}
                  </p>
                )}

                <p style={{ fontFamily: T.fontBody, fontSize: 13, color: T.ink500, margin: 0 }}>
                  {capacity > 0 ? `Capacidade: ${capacity} pessoas` : "Sem limite de vagas"}
                  {settings.admissionMode === "CONFIAVEL" && " · entrada a critério do host"}
                </p>

                {my === "REGISTERED" ? (
                  <>
                    <div
                      style={{
                        padding: "12px 16px",
                        background: T.successSoft,
                        border: `1px solid ${T.success}`,
                        borderRadius: 12,
                        fontFamily: T.fontBody,
                        fontSize: 14,
                        fontWeight: 600,
                        color: T.success,
                        textAlign: "center",
                      }}
                    >
                      ✓ Inscrito!
                    </div>
                    <GhostButton onClick={() => unregister(id)} disabled={busy === id}>
                      Sair
                    </GhostButton>
                  </>
                ) : my === "WAITLIST" ? (
                  <>
                    <div
                      style={{
                        padding: "12px 16px",
                        background: T.spark + "33",
                        border: `1px solid ${T.spark}`,
                        borderRadius: 12,
                        fontFamily: T.fontBody,
                        fontSize: 14,
                        fontWeight: 600,
                        color: T.ink,
                        textAlign: "center",
                      }}
                    >
                      Você está na fila
                      {myEvents[id]?.position ? ` · posição ${myEvents[id].position}` : ""}
                    </div>
                    <GhostButton onClick={() => unregister(id)} disabled={busy === id}>
                      Sair da fila
                    </GhostButton>
                  </>
                ) : (
                  <PrimaryButton onClick={() => register(id)} disabled={busy === id} fullWidth>
                    {busy === id ? "Inscrevendo..." : "Quero ir!"}
                  </PrimaryButton>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
}