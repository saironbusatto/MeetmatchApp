"use client";
import { useAuth } from "@/lib/auth";
import { getApiBaseUrl } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState, type JSX } from "react";
import Link from "next/link";
import { T } from "@/components/ui/tokens";
import { PrimaryButton } from "@/components/ui/Button";
import { StyledInput } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

const API = getApiBaseUrl();

export default function SignupPage(): JSX.Element {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) { setError(data.message ?? "Falha no cadastro"); return; }
      login(data.access_token, data.user);
      router.push("/dashboard");
    } catch {
      setLoading(false);
      setError("Erro ao conectar com o servidor. Tente novamente.");
    }
  }

  return (
    <div style={{ minHeight: "calc(100vh - 60px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: T.paper }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <h1 style={{ fontFamily: T.fontDisplay, fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", color: T.ink, marginBottom: 8 }}>
          ¡Vamos!
        </h1>
        <p style={{ fontFamily: T.fontBody, fontSize: 15, color: T.ink500, marginBottom: 32 }}>
          Crie sua conta e comece a planejar.
        </p>
        <Card>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <StyledInput label="Nome" type="text" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
            <StyledInput label="E-mail" type="email" placeholder="voce@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            <StyledInput label="Senha" type="password" placeholder="mínimo 8 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" />
            {error && (
              <p style={{ fontFamily: T.fontBody, fontSize: 14, color: T.vermillion, background: T.vermillionSoft, border: `1px solid ${T.vermillion}`, borderRadius: 10, padding: "10px 14px", margin: 0 }}>
                {error}
              </p>
            )}
            <PrimaryButton type="submit" disabled={loading} fullWidth>
              {loading ? "Criando conta..." : "Criar conta"}
            </PrimaryButton>
          </form>
        </Card>
        <p style={{ fontFamily: T.fontBody, fontSize: 14, color: T.ink500, textAlign: "center", marginTop: 20 }}>
          Já tem conta?{" "}
          <Link href="/login" style={{ color: T.vermillion, fontWeight: 600 }}>Entrar</Link>
        </p>
      </div>
    </div>
  );
}
