"use client";

import { useAuth } from "@/lib/auth";
import { createApiClient } from "@/lib/client";
import { getApiBaseUrl } from "@/lib/api";
import { useEffect, useState, type JSX } from "react";
import Link from "next/link";
import { T } from "@/components/ui/tokens";
import { Card } from "@/components/ui/Card";
import type { CSSProperties } from "react";

interface RegistrationRow {
  id: string;
  status: string;
  position?: number | null;
  userId?: string | null;
}

interface WaitlistRow {
  id: string;
  position: number;
  userId: string;
}

interface PublicEventDetailLite {
  title: string;
  capacity: number;
}

const API = getApiBaseUrl();

export default function HostPage({ params }: { params: Promise<{ id: string }> }): JSX.Element {
  const { token } = useAuth();
  const api = createApiClient(() => token);
  const [id, setId] = useState("");
  const [event, setEvent] = useState<PublicEventDetailLite | null>(null);
  const [registrations, setRegistrations] = useState<RegistrationRow[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistRow[]>([]);

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!token || !id) return;
    (async () => {
      try {
        const ev = await api.publicEvents.get(id);
        setEvent({ title: ev.event.title, capacity: ev.settings.capacity });
        const regs = await api.publicEvents.getRegistrations(id);
        setRegistrations(regs.registrations);
        const wl = await api.publicEvents.getWaitlist(id);
        setWaitlist(wl.waitlist);
      } catch {
        setEvent(null);
      }
    })();
  }, [token, id]);

  const confirmed = registrations.filter((r) => r.status === "REGISTERED");
  const came = registrations.filter((r) => r.status === "CANCELLED").length;
  const capacity = event?.capacity ?? 0;

  const pageStyle: CSSProperties = { maxWidth: 820, margin: "0 auto", padding: "40px 24px 80px" };
  const titleStyle: CSSProperties = { fontFamily: T.fontDisplay, fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em", color: T.ink, marginBottom: 8 };
  const statBoxStyle: CSSProperties = { background: T.white, border: `1px solid ${T.ink100}`, borderRadius: 16, padding: "16px 20px", boxShadow: T.stamp, textAlign: "center" };
  const statValueStyle: CSSProperties = { fontFamily: T.fontDisplay, fontSize: 30, fontWeight: 800, color: T.ink };
  const statLabelStyle: CSSProperties = { fontFamily: T.fontBody, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: T.ink500, marginTop: 4 };
  const rowStyle: CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${T.ink50}`, fontFamily: T.fontBody, fontSize: 15, color: T.ink };

  return (
    <main style={pageStyle}>
      <Link href={`/events/${id}`} style={{ fontFamily: T.fontBody, fontSize: 14, color: T.vermillion, textDecoration: "none" }}>
        ← Voltar
      </Link>
      <h1 style={titleStyle}>Painel do host</h1>
      <p style={{ fontFamily: T.fontBody, fontSize: 15, color: T.ink500, marginBottom: 28 }}>
        {event?.title ?? "Evento público"}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 24 }}>
        <div style={statBoxStyle}>
          <div style={statValueStyle}>{confirmed.length}</div>
          <div style={statLabelStyle}>Inscritos</div>
        </div>
        <div style={statBoxStyle}>
          <div style={statValueStyle}>{came}</div>
          <div style={statLabelStyle}>Cancelados</div>
        </div>
        <div style={statBoxStyle}>
          <div style={statValueStyle}>{waitlist.length}</div>
          <div style={statLabelStyle}>Na fila</div>
        </div>
        {capacity > 0 && (
          <div style={statBoxStyle}>
            <div style={statValueStyle}>{capacity - confirmed.length}</div>
            <div style={statLabelStyle}>Vagas livres</div>
          </div>
        )}
      </div>

      <p style={{ fontFamily: T.fontDisplay, fontSize: 16, fontWeight: 700, color: T.ink, margin: "24px 0 12px" }}>
        Inscritos ({confirmed.length}/{capacity || "—"})
      </p>
      <Card noShadow>
        {confirmed.length === 0 ? (
          <p style={{ fontFamily: T.fontBody, color: T.ink400, textAlign: "center", padding: "12px 0" }}>
            Ninguém inscrito ainda.
          </p>
        ) : (
          confirmed.map((r, i) => (
            <div key={r.id} style={rowStyle}>
              <span>{r.userId?.slice(0, 8) ?? `#${i + 1}`}</span>
              <span style={{ fontFamily: T.fontMono, fontSize: 12, color: T.ink400 }}>
                {r.userId ? "confirmado" : "sem perfil"}
              </span>
            </div>
          ))
        )}
      </Card>

      <p style={{ fontFamily: T.fontDisplay, fontSize: 16, fontWeight: 700, color: T.ink, margin: "24px 0 12px" }}>
        Fila de espera ({waitlist.length})
      </p>
      <Card noShadow>
        <p style={{ fontFamily: T.fontBody, fontSize: 13, color: T.ink400, margin: "0 0 8px" }}>
          A primeira pessoa da fila entra automaticamente quando abrir vaga.
        </p>
        {waitlist.length === 0 ? (
          <p style={{ fontFamily: T.fontBody, color: T.ink400, textAlign: "center", padding: "12px 0" }}>
            Fila vazia.
          </p>
        ) : (
          waitlist.map((w) => (
            <div key={w.id} style={rowStyle}>
              <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 24,
                    height: 24,
                    borderRadius: 999,
                    background: w.position === 1 ? T.spark + "44" : T.ink100,
                    color: w.position === 1 ? T.ink : T.ink500,
                    fontFamily: T.fontMono,
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {w.position}
                </span>
                <span>{w.userId.slice(0, 8)}</span>
              </span>
              {w.position === 1 && (
                <span style={{ fontFamily: T.fontBody, fontSize: 12, fontWeight: 600, color: T.vermillion }}>
                  próximo
                </span>
              )}
            </div>
          ))
        )}
      </Card>

      <a
        href={`${API}/public-events/${id}/registrations?format=csv`}
        target="_blank"
        rel="noreferrer"
        style={{ display: "inline-block", marginTop: 20, fontFamily: T.fontBody, fontSize: 14, color: T.vermillion, textDecoration: "underline" }}
      >
        Exportar CSV
      </a>
    </main>
  );
}