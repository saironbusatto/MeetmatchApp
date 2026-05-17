"use client";

import { useAuth } from "@/lib/auth";
import Link from "next/link";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <main>
      <h1>Dashboard</h1>
      <p>Olá, {user?.name ?? ""}</p>
      <div className="grid">
        <Link href="/events/new">Criar evento</Link>
        <Link href="/public">Feed público</Link>
        <button onClick={logout}>Sair</button>
      </div>
    </main>
  );
}
