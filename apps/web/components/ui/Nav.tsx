"use client";

import Link from "next/link";
import { useUser, useClerk } from "@clerk/nextjs";
import { T } from "./tokens";
import type { CSSProperties, JSX } from "react";

export function Nav(): JSX.Element {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const navStyle: CSSProperties = {
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: T.paper,
    borderBottom: `1px solid ${T.ink100}`,
    padding: "0 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 60,
  };

  const logoStyle: CSSProperties = {
    fontFamily: T.fontDisplay,
    fontSize: 22,
    fontWeight: 700,
    color: T.ink,
    letterSpacing: "-0.02em",
    textDecoration: "none",
  };

  const logoSpanStyle: CSSProperties = {
    display: "inline-block",
    width: 10,
    height: 10,
    background: T.vermillion,
    borderRadius: "50%",
    marginLeft: 3,
    verticalAlign: "middle",
    position: "relative",
    top: -2,
  };

  const linksStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
  };

  const linkStyle: CSSProperties = {
    fontFamily: T.fontBody,
    fontSize: 14,
    fontWeight: 500,
    color: T.ink600,
    padding: "6px 14px",
    borderRadius: 999,
    textDecoration: "none",
    transition: "background 0.1s",
  };

  const ctaLinkStyle: CSSProperties = {
    ...linkStyle,
    background: T.vermillion,
    color: T.white,
    fontWeight: 600,
    border: "2px solid #0A0A0A",
    boxShadow: "2px 2px 0 #0A0A0A",
  };

  const logoutStyle: CSSProperties = {
    ...linkStyle,
    background: "transparent",
    border: "none",
    cursor: "pointer",
  };

  return (
    <nav style={navStyle}>
      <Link href="/" style={logoStyle}>
        Farmei<span style={logoSpanStyle} />
      </Link>
      <div style={linksStyle}>
        {isLoaded && user ? (
          <>
            <Link href="/dashboard" style={linkStyle}>
              Dashboard
            </Link>
            <Link href="/public" style={linkStyle}>
              Eventos
            </Link>
            <button
              onClick={() => signOut({ redirectUrl: "/login" })}
              style={logoutStyle}
            >
              Sair
            </button>
          </>
        ) : (
          <>
            <Link href="/login" style={linkStyle}>
              Entrar
            </Link>
            <Link href="/signup" style={ctaLinkStyle}>
              Criar conta
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
