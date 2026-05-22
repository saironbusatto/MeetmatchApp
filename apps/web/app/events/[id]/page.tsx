"use client";

import { useApiToken } from "@/hooks/useApiToken";
import { getApiBaseUrl } from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";

const API = getApiBaseUrl();

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const getToken = useApiToken();
  const [id, setId] = useState("");
  const [event, setEvent] = useState<any>(null);

  useEffect(() => { params.then((p) => setId(p.id)); }, [params]);

  useEffect(() => {
    if (!id) return;
    getToken().then((token) => {
      if (!token) return;
      fetch(`${API}/private-events/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => r.json())
        .then((data) => setEvent(data.event ?? null));
    });
  }, [id]);

  return (
    <main>
      <h1>Evento</h1>
      <pre>{JSON.stringify(event, null, 2)}</pre>
      <div className="grid">
        <Link href={`/events/${id}/availability`}>Disponibilidade</Link>
        <Link href={`/events/${id}/host`}>Painel do host</Link>
      </div>
    </main>
  );
}
