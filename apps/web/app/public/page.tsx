"use client";

import { useApiToken } from "@/hooks/useApiToken";
import { getApiBaseUrl } from "@/lib/api";
import { useEffect, useState } from "react";
import { VirtualizedEventList } from "@/components/VirtualizedEventList";
import { MasonryEventGrid } from "@/components/MasonryEventGrid";

const API = getApiBaseUrl();

export default function PublicPage() {
  const getToken = useApiToken();
  const [events, setEvents] = useState<any[]>([]);
  const [view, setView] = useState<"list" | "grid">("list");

  useEffect(() => {
    getToken().then((token) => {
      if (!token) return;
      fetch(`${API}/public-events`, { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => r.json())
        .then((data) => setEvents(data.data ?? []));
    });
  }, []);

  const mapped = events.map((item) => ({
    id: item.event.id,
    title: item.event.title ?? "",
    description: item.event.description,
    eventDate: item.settings?.eventDate,
    maxCapacity: item.settings?.maxCapacity,
    currentCount: item.settings?.currentCount,
  }));

  return (
    <main>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Eventos públicos</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setView("list")} style={{ fontWeight: view === "list" ? 700 : 400 }}>Lista</button>
          <button onClick={() => setView("grid")} style={{ fontWeight: view === "grid" ? 700 : 400 }}>Grid</button>
        </div>
      </div>
      {view === "list" ? (
        <div style={{ height: "70vh" }}>
          <VirtualizedEventList events={mapped} />
        </div>
      ) : (
        <MasonryEventGrid events={mapped} columns={2} />
      )}
    </main>
  );
}
