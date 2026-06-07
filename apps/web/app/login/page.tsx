"use client";
import { useAuth } from "@/lib/auth";
import { getApiBaseUrl } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { T } from "@/components/ui/tokens";
import { PrimaryButton } from "@/components/ui/Button";
import { StyledInput } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
const API = getApiBaseUrl();
export default function LoginPage() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [error, setError] = useState<string|null>(null); const [loading, setLoading] = useState(false);
  const { login } = useAuth(); const router = useRouter();
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError(null);
    const res = await fetch(`${API}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    const data = await res.json(); setLoading(false);
    if (!res.ok) { setError(data.message ?? "Falha no login"); return; }
    login(data.access_token, data.user); router.push("/dashboard");
  }
  return (
    <div style={{ minHeight: "calc(100vh - 60px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: T.paper }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <h1 style={{ fontFamily: T.fontDisplay, fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", color: T.ink, marginBottom: 8 }}>Bem-vindo de volta.</h1>
        <p style={{ fontFamily: T.fontBody, fontSize: 15, color: T.ink500, marginBottom: 32 }}>Entre pra ver seus eventos.</p>
        <Card>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <StyledInput label="E-mail" type="email" placeholder="voce@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            <StyledInput label="Senha" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
            {error && <p style={{ fontFamily: T.fontBody, fontSize: 14, color: T.vermillion, background: T.vermillionSoft, border: `1px solid ${T.vermillion}`, borderRadius: 10, padding: "10px 14px" }}>{error}</p>}
            <PrimaryButton type="submit" disabled={loading} fullWidth>{loading ? "Entrando..." : "Entrar"}</PrimaryButton>
          </form>
        </Card>
        <p style={{ fontFamily: T.fontBody, fontSize: 14, color: T.ink500, textAlign: "center", marginTop: 20 }}>Não tem conta? <Link href="/signup" style={{ color: T.vermillion, fontWeight: 600 }}>Criar conta</Link></p>
      </div>
    </div>
  );
}
