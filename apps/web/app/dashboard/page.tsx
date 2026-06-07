"use client";

import { useUser } from "@clerk/nextjs";
import { useApiToken } from "@/hooks/useApiToken";
import { getApiBaseUrl } from "@/lib/api";
import { useEffect, useState } from "react";
import Link from "next/link";
import { T } from "@/components/ui/tokens";
import { PrimaryButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { CSSProperties, JSX } from "react";

const API = getApiBaseUrl();

interface EventItem {
  id: string;
  title: string;
  type: "PRIVATE" | "PUBLIC";
  eventDate?: string;
  dateWindowStart?: string;
  dateWindowEnd?: string;
}

export default function DashboardPage(): JSX.Element {
  const { user } = useUser();
  const getToken = useApiToken();
  const [privateEvents, setPrivateEvents] = useState<EventItem[]>([]);
  const [publicEvents, setPublicEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    getToken().then((token) => {
      if (!token) return;
      const headers = { Authorization: `Bearer ${token}` };
      fetch(`${API}/private-events`, { headers })
        .then((r) => r.json())
        .then((data) => setPrivateEvents(
          (data.data ?? []).map((item: any) => ({
            id: item.event?.id ?? item.id,
            title: item.event?.title ?? item.title ?? "Sem título",
            type: "PRIVATE" as const,
            dateWindowStart: item.settings?.dateWindowStart,
            dateWindowEnd: item.settings?.dateWindowEnd,
          }))
        ))
        .catch(() => null);

      fetch(`${API}/public-events`, { headers })
        .then((r) => r.json())
        .then((data) => setPublicEvents(
          (data.data ?? []).map((item: any) => ({
            id: item.event?.id ?? item.id,
            title: item.event?.title ?? item.title ?? "Sem título",
            type: "PUBLIC" as const,
            eventDate: item.settings?.eventDate,
          }))
        ))
        .catch(() => null);
    });
  }, []);

  const allEvents: EventItem[] = [...privateEvents, ...publicEvents];

  const pageStyle: CSSProperties = {
    maxWidth: 1024,
    margin: "0 auto",
    padding: "40px 24px 80px",
  };

  const headerStyle: CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 40,
    flexWrap: "wrap",
    gap: 16,
  };

  const greetingStyle: CSSProperties = {
    fontFamily: T.fontBody,
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: T.vermillion,
    marginBottom: 8,
  };

  const titleStyle: CSSProperties = {
    fontFamily: T.fontDisplay,
    fontSize: 36,
    fontWeight: 800,
    letterSpacing: "-0.02em",
    color: T.ink,
    margin: 0,
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

  const badgeStyle = (type: "PRIVATE" | "PUBLIC"): CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    padding: "3px 10px",
    borderRadius: 999,
    fontFamily: T.fontBody,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    background: type === "PRIVATE" ? T.ink50 : T.vermillionSoft,
    color: type === "PRIVATE" ? T.ink500 : T.vermillion,
    border: `1px solid ${type === "PRIVATE" ? T.ink100 : T.vermillion}`,
  });

  const cardTitleStyle: CSSProperties = {
    fontFamily: T.fontDisplay,
    fontSize: 20,
    fontWeight: 700,
    color: T.ink,
    marginBottom: 8,
    marginTop: 10,
  };

  const cardDateStyle: CSSProperties = {
    fontFamily: T.fontMono,
    fontSize: 13,
    color: T.ink400,
    marginBottom: 16,
  };

  return (
    <main style={pageStyle}>
      <div style={headerStyle}>
        <div>
          <p style={greetingStyle}>Buenas, {user?.firstName ?? user?.username ?? "você"}</p>
          <h1 style={titleStyle}>Seus eventos</h1>
        </div>
        <Link href="/events/new">
          <PrimaryButton>+ Novo evento</PrimaryButton>
        </Link>
      </div>

      {allEvents.length === 0 ? (
        <div style={emptyStyle}>
          <p>Nenhum evento ainda.</p>
          <p style={{ fontSize: 14, marginTop: 8 }}>
            Crie seu primeiro evento clicando em &quot;+ Novo evento&quot;.
          </p>
        </div>
      ) : (
        <div style={gridStyle}>
          {allEvents.map((ev) => (
            <Link
              key={ev.id}
              href={ev.type === "PRIVATE" ? `/events/${ev.id}` : `/events/${ev.id}/host`}
              style={{ textDecoration: "none" }}
            >
              <Card style={{ cursor: "pointer" }}>
                <span style={badgeStyle(ev.type)}>
                  {ev.type === "PRIVATE" ? "Privado" : "Público"}
                </span>
                <h3 style={cardTitleStyle}>{ev.title}</h3>
                {ev.eventDate && (
                  <p style={cardDateStyle}>{new Date(ev.eventDate).toLocaleDateString("pt-BR")}</p>
                )}
                {ev.dateWindowStart && ev.dateWindowEnd && (
                  <p style={cardDateStyle}>
                    {new Date(ev.dateWindowStart).toLocaleDateString("pt-BR")} —{" "}
                    {new Date(ev.dateWindowEnd).toLocaleDateString("pt-BR")}
                  </p>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
