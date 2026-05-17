"use client";

import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

export default function NewEventPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [type, setType] = useState<"PRIVATE" | "PUBLIC">("PRIVATE");
  const [title, setTitle] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [capacity, setCapacity] = useState(10);

  async function create() {
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
        <select value={type} onChange={(e) => setType(e.target.value as "PRIVATE" | "PUBLIC") }>
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
