"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <main>
      <h1>Dashboard</h1>
      <p>Olá, {user?.firstName ?? user?.username ?? ""}</p>
      <div className="grid">
        <Link href="/events/new">Criar evento</Link>
        <Link href="/public">Feed público</Link>
        <button onClick={() => signOut({ redirectUrl: "/login" })}>Sair</button>
      </div>
    </main>
  );
}
