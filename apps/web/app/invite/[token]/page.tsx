"use client";

import { useState, type JSX } from "react";
import { useAuth } from "@/lib/auth";
import { createApiClient } from "@/lib/client";
import { useRouter } from "next/navigation";
import { T } from "@/components/ui/tokens";
import { PrimaryButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { CSSProperties } from "react";

export default function InvitePage({ params }: { params: Promise<{ token: string }> }): JSX.Element {
  const router = useRouter();
  const { token } = useAuth();
  const api = createApiClient(() => null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function accept() {
    setBusy(true);
    setMessage(null);
    setError(null);
    try {
      const p = await params;
      const res = await api.invites.accept(p.token);
      setMessage("Convite aceito! 🎉");
      if (token) router.push(`/events/${res.eventId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao aceitar convite.");
    } finally {
      setBusy(false);
    }
  }

  const pageStyle: CSSProperties = { maxWidth: 480, margin: "0 auto", padding: "80px 24px" };
  const titleStyle: CSSProperties = { fontFamily: T.fontDisplay, fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", color: T.ink, margin: 0 };

  return (
    <main style={pageStyle}>
      <Card>
        <h1 style={titleStyle}>Convite</h1>
        <p style={{ fontFamily: T.fontBody, fontSize: 15, color: T.ink500, margin: "8px 0 20px" }}>
          Alguém te convidou pra um evento no Farmei.
        </p>

        {message && (
          <p style={{ fontFamily: T.fontBody, fontSize: 15, fontWeight: 600, color: T.success, marginBottom: 16 }}>
            {message}
          </p>
        )}
        {error && (
          <p style={{ fontFamily: T.fontBody, fontSize: 15, fontWeight: 600, color: T.vermillion, marginBottom: 16 }}>
            {error}
          </p>
        )}

        <PrimaryButton onClick={accept} disabled={busy} fullWidth>
          {busy ? "Aceitando..." : "Aceitar convite"}
        </PrimaryButton>
      </Card>
    </main>
  );
}