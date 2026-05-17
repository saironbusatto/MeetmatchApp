"use client";

import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

export default function SignupPage() {
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
    const res = await fetch(`${API}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.message ?? "Falha no cadastro");
      return;
    }

    login(data.access_token, data.user);
    router.push("/dashboard");
  }

  return (
    <main>
      <h1>Criar conta</h1>
      <form onSubmit={handleSubmit} className="grid card">
        <input placeholder="nome" value={name} onChange={(e) => setName(e.target.value)} required />
        <input placeholder="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input placeholder="senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error ? <p>{error}</p> : null}
        <button type="submit" disabled={loading}>{loading ? "Criando..." : "Criar conta"}</button>
      </form>
    </main>
  );
}
