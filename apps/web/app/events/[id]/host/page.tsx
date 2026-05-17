"use client";

import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

export default function HostPage({ params }: { params: Promise<{ id: string }> }) {
  const { token } = useAuth();
  const [id, setId] = useState("");
  const [registrations, setRegistrations] = useState<any[]>([]);

  useEffect(() => { params.then((p) => setId(p.id)); }, [params]);
  useEffect(() => {
    if (!token || !id) return;
    fetch(`${API}/public-events/${id}/registrations`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => setRegistrations(data.registrations ?? []));
  }, [token, id]);

  return (
    <main>
      <h1>Painel do host</h1>
      <p>Total de inscritos: {registrations.filter((r) => r.status === "REGISTERED").length}</p>
      <a href={`${API}/public-events/${id}/registrations?format=csv`} target="_blank">Exportar CSV</a>
      <pre>{JSON.stringify(registrations, null, 2)}</pre>
    </main>
  );
}
