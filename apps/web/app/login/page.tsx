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
import type { CSSProperties, JSX } from "react";

const API = getApiBaseUrl();

export default function LoginPage(): JSX.Element {
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
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.message ?? "Falha no login");
      return;
    }

    login(data.access_token, data.user);
    router.push("/dashboard");
  }

  const wrapStyle: CSSProperties = {
    minHeight: "calc(100vh - 60px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    background: T.paper,
  };

  const innerStyle: CSSProperties = {
    width: "100%",
    maxWidth: 440,
  };

  const headlineStyle: CSSProperties = {
    fontFamily: T.fontDisplay,
    fontSize: 36,
    fontWeight: 800,
    letterSpacing: "-0.03em",
    color: T.ink,
    marginBottom: 8,
  };

  const subStyle: CSSProperties = {
    fontFamily: T.fontBody,
    fontSize: 15,
    color: T.ink500,
    marginBottom: 32,
  };

  const formStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  };

  const errorStyle: CSSProperties = {
    fontFamily: T.fontBody,
    fontSize: 14,
    color: T.vermillion,
    background: T.vermillionSoft,
    border: `1px solid ${T.vermillion}`,
    borderRadius: 10,
    padding: "10px 14px",
  };

  const footerStyle: CSSProperties = {
    fontFamily: T.fontBody,
    fontSize: 14,
    color: T.ink500,
    textAlign: "center",
    marginTop: 20,
  };

  return (
    <div style={wrapStyle}>
      <div style={innerStyle}>
        <h1 style={headlineStyle}>Bem-vindo de volta.</h1>
        <p style={subStyle}>Entre pra ver seus eventos.</p>

        <Card>
          <form onSubmit={handleSubmit} style={formStyle}>
            <StyledInput
              label="E-mail"
              type="email"
              placeholder="voce@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <StyledInput
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            {error && <p style={errorStyle}>{error}</p>}
            <PrimaryButton type="submit" disabled={loading} fullWidth>
              {loading ? "Entrando..." : "Entrar"}
            </PrimaryButton>
          </form>
        </Card>

        <p style={footerStyle}>
          Não tem conta?{" "}
          <Link href="/signup" style={{ color: T.vermillion, fontWeight: 600 }}>
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}
