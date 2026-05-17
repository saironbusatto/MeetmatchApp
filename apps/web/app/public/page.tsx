"use client";

import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

export default function PublicPage(): JSX.Element {
  const { token } = useAuth();
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/public-events`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => setEvents(data.data ?? []));
  }, [token]);

  return (
    <main>
      <h1>Eventos públicos</h1>
      <div className="grid">
        {events.map((item) => (
          <div className="card" key={item.event.id}>
            <h3>{item.event.title}</h3>
            <p>{item.settings?.eventDate}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
