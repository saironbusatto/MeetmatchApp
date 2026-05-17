"use client";

import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { token } = useAuth();
  const [id, setId] = useState("");
  const [event, setEvent] = useState<any>(null);

  useEffect(() => { params.then((p) => setId(p.id)); }, [params]);
  useEffect(() => {
    if (!token || !id) return;
    fetch(`${API}/private-events/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => setEvent(data.event ?? null));
  }, [token, id]);

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
