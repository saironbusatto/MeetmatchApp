"use client";

import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

export default function InvitePage({ params }: { params: Promise<{ token: string }> }): JSX.Element {
  const [message, setMessage] = useState("");

  async function accept() {
    const p = await params;
    const res = await fetch(`${API}/invites/${p.token}/accept`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
    const data = await res.json();
    setMessage(res.ok ? "Convite aceito" : (data.message ?? "Erro"));
  }

  return (
    <main>
      <h1>Convite</h1>
      <button onClick={accept}>Aceitar convite</button>
      <p>{message}</p>
    </main>
  );
}
