"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { T } from "./tokens";
import type { CSSProperties } from "react";

export function Nav() {
  const { user, logout } = useAuth();
  const nav: CSSProperties = { position: "sticky", top: 0, zIndex: 100, background: T.paper, borderBottom: `1px solid ${T.ink100}`, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 };
  const logo: CSSProperties = { fontFamily: T.fontDisplay, fontSize: 22, fontWeight: 700, color: T.ink, letterSpacing: "-0.02em", textDecoration: "none" };
  const dot: CSSProperties = { display: "inline-block", width: 10, height: 10, background: T.vermillion, borderRadius: "50%", marginLeft: 3, verticalAlign: "middle", position: "relative", top: -2 };
  const link: CSSProperties = { fontFamily: T.fontBody, fontSize: 14, fontWeight: 500, color: T.ink600, padding: "6px 14px", borderRadius: 999, textDecoration: "none" };
  const cta: CSSProperties = { ...link, background: T.vermillion, color: T.white, fontWeight: 600, border: `2px solid ${T.ink}`, boxShadow: "2px 2px 0 #0A0A0A" };
  const btn: CSSProperties = { ...link, background: "transparent", border: "none", cursor: "pointer" };
  return (
    <nav style={nav}>
      <Link href="/" style={logo}>Farmei<span style={dot} /></Link>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {user ? (<><Link href="/dashboard" style={link}>Dashboard</Link><Link href="/public" style={link}>Eventos</Link><button onClick={logout} style={btn}>Sair</button></>) : (<><Link href="/login" style={link}>Entrar</Link><Link href="/signup" style={cta}>Criar conta</Link></>)}
      </div>
    </nav>
  );
}
