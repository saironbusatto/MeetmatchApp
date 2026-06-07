"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { T } from "./tokens";
import type { CSSProperties } from "react";

export function Nav() {
  const { user, logout } = useAuth();

  const navStyle: CSSProperties = { position: "sticky", top: 0, zIndex: 100, background: T.paper, borderBottom: `1px solid ${T.ink100}`, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 };
  const logoStyle: CSSProperties = { fontFamily: T.fontDisplay, fontSize: 22, fontWeight: 700, color: T.ink, letterSpacing: "-0.02em", textDecoration: "none" };
  const dotStyle: CSSProperties = { display: "inline-block", width: 10, height: 10, background: T.vermillion, borderRadius: "50%", marginLeft: 3, verticalAlign: "middle", position: "relative", top: -2 };
  const linkStyle: CSSProperties = { fontFamily: T.fontBody, fontSize: 14, fontWeight: 500, color: T.ink600, padding: "6px 14px", borderRadius: 999, textDecoration: "none" };
  const ctaStyle: CSSProperties = { ...linkStyle, background: T.vermillion, color: T.white, fontWeight: 600, border: `2px solid ${T.ink}`, boxShadow: "2px 2px 0 #0A0A0A" };
  const btnStyle: CSSProperties = { ...linkStyle, background: "transparent", border: "none", cursor: "pointer" };

  return (
    <nav style={navStyle}>
      <Link href="/" style={logoStyle}>Farmei<span style={dotStyle} /></Link>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {user ? (
          <>
            <Link href="/dashboard" style={linkStyle}>Dashboard</Link>
            <Link href="/public" style={linkStyle}>Eventos</Link>
            <button onClick={logout} style={btnStyle}>Sair</button>
          </>
        ) : (
          <>
            <Link href="/login" style={linkStyle}>Entrar</Link>
            <Link href="/signup" style={ctaStyle}>Criar conta</Link>
          </>
        )}
      </div>
    </nav>
  );
}
