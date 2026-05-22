"use client";

import { useApiToken } from "@/hooks/useApiToken";
import { getApiBaseUrl } from "@/lib/api";
import { useEffect, useState } from "react";

const API = getApiBaseUrl();

export default function AvailabilityPage({ params }: { params: Promise<{ id: string }> }) {
  const getToken = useApiToken();
  const [id, setId] = useState("");
  const [date, setDate] = useState("");
  const [response, setResponse] = useState<"YES" | "MAYBE" | "NO">("YES");

  useEffect(() => { params.then((p) => setId(p.id)); }, [params]);

  async function save() {
    const token = await getToken();
    if (!token || !id) return;
    await fetch(`${API}/private-events/${id}/availability`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ responses: [{ date, response }] })
    });
  }

  return (
    <main>
      <h1>Disponibilidade</h1>
      <div className="grid card">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <select value={response} onChange={(e) => setResponse(e.target.value as "YES" | "MAYBE" | "NO")}>
          <option>YES</option>
          <option>MAYBE</option>
          <option>NO</option>
        </select>
        <button onClick={save}>Salvar</button>
      </div>
    </main>
  );
}
