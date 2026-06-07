"use client";

import { useAuth } from "@/lib/auth";
import { getApiBaseUrl } from "@/lib/api";
import { useEffect, useState } from "react";
import { T } from "@/components/ui/tokens";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { CSSProperties, JSX } from "react";

const API = getApiBaseUrl();

interface PublicEvent {
  id: string;
  title: string;
  description?: string;
  eventDate?: string;
  maxCapacity?: number;
  currentCount?: number;
}

export default function PublicPage(): JSX.Element {
  const { token } = useAuth();
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [registering, setRegistering] = useState<string | null>(null);
  const [registered, setRegistered] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/public-events`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        const mapped = (data.data ?? []).map((item: any): PublicEvent => ({
          id: item.event.id,
          title: item.event.title ?? "",
          description: item.event.description,
          eventDate: item.settings?.eventDate,
          maxCapacity: item.settings?.maxCapacity,
          currentCount: item.settings?.currentCount,
        }));
        setEvents(mapped);
      });
  }, [token]);

  async function register(eventId: string) {
    if (!token) return;
    setRegistering(eventId);
    const res = await fetch(`${API}/public-events/${eventId}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({}),
    });
    setRegistering(null);
    if (res.ok) {
      setRegistered((prev) => new Set([...prev, eventId]));
      setEvents((prev) =>
        prev.map((e) =>
          e.id === eventId
            ? { ...e, currentCount: (e.currentCount ?? 0) + 1 }
            : e
        )
      );
    }
  }

  const pageStyle: CSSProperties = {
    maxWidth: 1024,
    margin: "0 auto",
    padding: "40px 24px 80px",
  };

  const headerStyle: CSSProperties = {
    marginBottom: 40,
  };

  const titleStyle: CSSProperties = {
    fontFamily: T.fontDisplay,
    fontSize: 36,
    fontWeight: 800,
    letterSpacing: "-0.02em",
    color: T.ink,
    margin: 0,
  };

  const eyebrowStyle: CSSProperties = {
    fontFamily: T.fontBody,
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: T.vermillion,
    marginBottom: 8,
  };

  const gridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: 20,
  };

  const emptyStyle: CSSProperties = {
    fontFamily: T.fontBody,
    fontSize: 16,
    color: T.ink400,
    padding: "60px 0",
    textAlign: "center",
  };

  return (
    <main style={pageStyle}>
      <div style={headerStyle}>
        <p style={eyebrowStyle}>Feed aberto</p>
        <h1 style={titleStyle}>Eventos públicos</h1>
      </div>

      {events.length === 0 ? (
        <div style={emptyStyle}>Nenhum evento público disponível no momento.</div>
      ) : (
        <div style={gridStyle}>
          {events.map((ev) => {
            const pct = ev.maxCapacity
              ? Math.min(100, Math.round(((ev.currentCount ?? 0) / ev.maxCapacity) * 100))
              : 0;
            const isFull = ev.maxCapacity !== undefined && (ev.currentCount ?? 0) >= ev.maxCapacity;
            const isRegistered = registered.has(ev.id);

            const barColor = pct >= 90 ? T.vermillion : pct >= 60 ? T.warn : T.success;

            return (
              <Card key={ev.id} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {ev.eventDate && (
                  <div
                    style={{
                      fontFamily: T.fontMono,
                      fontSize: 12,
                      color: T.ink400,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {new Date(ev.eventDate + "T12:00:00").toLocaleDateString("pt-BR", {
                      weekday: "long",
                      day: "2-digit",
                      month: "long",
                    })}
                  </div>
                )}

                <h3
                  style={{
                    fontFamily: T.fontDisplay,
                    fontSize: 20,
                    fontWeight: 700,
                    color: T.ink,
                    margin: 0,
                  }}
                >
                  {ev.title}
                </h3>

                {ev.description && (
                  <p
                    style={{
                      fontFamily: T.fontBody,
                      fontSize: 14,
                      color: T.ink500,
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    {ev.description}
                  </p>
                )}

                {ev.maxCapacity !== undefined && (
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 6,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: T.fontBody,
                          fontSize: 13,
                          color: T.ink500,
                        }}
                      >
                        {ev.currentCount ?? 0} / {ev.maxCapacity} inscritos
                      </span>
                      <span
                        style={{
                          fontFamily: T.fontMono,
                          fontSize: 12,
                          fontWeight: 700,
                          color: barColor,
                        }}
                      >
                        {pct}%
                      </span>
                    </div>
                    <div
                      style={{
                        height: 8,
                        background: T.ink100,
                        borderRadius: 999,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${pct}%`,
                          background: barColor,
                          borderRadius: 999,
                          transition: "width 0.3s",
                        }}
                      />
                    </div>
                  </div>
                )}

                {isRegistered ? (
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
                ) : isFull ? (
                  <SecondaryButton disabled fullWidth style={{ opacity: 0.4 }}>
                    Lotado
                  </SecondaryButton>
                ) : (
                  <PrimaryButton
                    onClick={() => register(ev.id)}
                    disabled={registering === ev.id}
                    fullWidth
                  >
                    {registering === ev.id ? "Inscrevendo..." : "Quero ir!"}
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
