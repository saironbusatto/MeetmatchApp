"use client";

import { useApiToken } from "@/hooks/useApiToken";
import { getApiBaseUrl } from "@/lib/api";
import { useEffect, useState } from "react";

const API = getApiBaseUrl();

export default function HostPage({ params }: { params: Promise<{ id: string }> }) {
  const getToken = useApiToken();
  const [id, setId] = useState("");
  const [registrations, setRegistrations] = useState<any[]>([]);

  useEffect(() => { params.then((p) => setId(p.id)); }, [params]);

  useEffect(() => {
    if (!id) return;
    getToken().then((token) => {
      if (!token) return;
      fetch(`${API}/public-events/${id}/registrations`, { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => r.json())
        .then((data) => setRegistrations(data.registrations ?? []));
    });
  }, [id]);

  return (
    <main>
      <h1>Painel do host</h1>
      <p>Total de inscritos: {registrations.filter((r) => r.status === "REGISTERED").length}</p>
      <a href={`${API}/public-events/${id}/registrations?format=csv`} target="_blank">Exportar CSV</a>
      <pre>{JSON.stringify(registrations, null, 2)}</pre>
    </main>
  );
}
