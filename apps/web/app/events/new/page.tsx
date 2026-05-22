"use client";

import { useApiToken } from "@/hooks/useApiToken";
import { getApiBaseUrl } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

const API = getApiBaseUrl();

export default function NewEventPage() {
  const router = useRouter();
  const getToken = useApiToken();
  const [type, setType] = useState<"PRIVATE" | "PUBLIC">("PRIVATE");
  const [title, setTitle] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [capacity, setCapacity] = useState(10);

  async function create() {
    const token = await getToken();
    if (!token) return;

    if (type === "PRIVATE") {
      const res = await fetch(`${API}/private-events`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, dateWindowStart: dateStart, dateWindowEnd: dateEnd })
      });
      const data = await res.json();
      if (res.ok) router.push(`/events/${data.event.id}`);
    } else {
      const res = await fetch(`${API}/public-events`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, eventDate, capacity })
      });
      const data = await res.json();
      if (res.ok) router.push(`/events/${data.event.id}/host`);
    }
  }

  return (
    <main>
      <h1>Novo evento</h1>
      <div className="grid card">
        <select value={type} onChange={(e) => setType(e.target.value as "PRIVATE" | "PUBLIC")}>
          <option value="PRIVATE">Privado</option>
          <option value="PUBLIC">Público</option>
        </select>
        <input placeholder="título" value={title} onChange={(e) => setTitle(e.target.value)} />
        {type === "PRIVATE" ? (
          <>
            <input type="date" value={dateStart} onChange={(e) => setDateStart(e.target.value)} />
            <input type="date" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} />
          </>
        ) : (
          <>
            <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
            <input type="number" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} />
          </>
        )}
        <button onClick={create}>Criar</button>
      </div>
    </main>
  );
}
