"use client";

import { useSignIn } from "@clerk/nextjs";

export default function LoginPage() {
  const { signIn, isLoaded } = useSignIn();

  async function handleOAuth(provider: "oauth_google" | "oauth_apple") {
    if (!isLoaded) return;
    await signIn.authenticateWithRedirect({
      strategy: provider,
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/dashboard",
    });
  }

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FAFAF7" }}>
      <div style={{ width: "100%", maxWidth: 400, padding: "0 24px" }}>
        <h1 style={{ fontFamily: "var(--font-display, 'Bricolage Grotesque', sans-serif)", fontWeight: 800, fontSize: 38, letterSpacing: "-0.035em", color: "#0A0A0A", margin: "0 0 8px" }}>
          Bora marcar?
        </h1>
        <p style={{ fontFamily: "var(--font-body, 'Geist', sans-serif)", fontSize: 16, color: "#5F5D57", margin: "0 0 36px" }}>
          Entra pra ver o que tá rolando.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <OAuthButton onClick={() => handleOAuth("oauth_google")} label="Continuar com Google" icon={<GoogleIcon />} bg="#fff" fg="#0A0A0A" />
          <OAuthButton onClick={() => handleOAuth("oauth_apple")}  label="Continuar com Apple"  icon={<AppleIcon />}  bg="#0A0A0A" fg="#FAFAF7" />
        </div>

        <p style={{ fontFamily: "var(--font-body, 'Geist', sans-serif)", fontSize: 12, color: "#8C8A82", textAlign: "center", marginTop: 20 }}>
          Ao continuar você concorda com os <strong style={{ color: "#3F3E3A" }}>Termos</strong> e a <strong style={{ color: "#3F3E3A" }}>Privacidade</strong>.
        </p>
      </div>
    </main>
  );
}

function OAuthButton({ onClick, label, icon, bg, fg }: {
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
  bg: string;
  fg: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%", height: 54, display: "flex", alignItems: "center", gap: 14,
        padding: "0 22px", borderRadius: 16, border: "2px solid #0A0A0A",
        background: bg, color: fg,
        fontFamily: "var(--font-body, 'Geist', sans-serif)", fontWeight: 600, fontSize: 15,
        cursor: "pointer", boxShadow: "2px 3px 0 #0A0A0A",
        transition: "box-shadow 120ms, transform 120ms",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "3px 4px 0 #0A0A0A"; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "2px 3px 0 #0A0A0A"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {icon}
      <span style={{ flex: 1, textAlign: "left" }}>{label}</span>
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.32A9 9 0 0 0 9 18Z"/>
      <path fill="#FBBC05" d="M3.97 10.71c-.18-.54-.28-1.11-.28-1.71s.1-1.17.28-1.71V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.04l3.01-2.33Z"/>
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.34l2.58-2.58A9 9 0 0 0 9 0 9 9 0 0 0 .96 4.96l3.01 2.33A5.36 5.36 0 0 1 9 3.58Z"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 384 512" fill="#FAFAF7" aria-hidden="true">
      <path d="M318.7 268c-.45-44.83 36.6-66.5 38.32-67.55-20.94-30.6-53.49-34.83-65-35.31-27.39-2.83-53.59 16.19-67.45 16.19-13.99 0-35.43-15.81-58.31-15.36-29.94.45-57.61 17.42-72.97 44.18-31.21 54-7.92 133.7 22.21 177.32 14.74 21.36 32.04 45.27 54.85 44.45 22.06-.91 30.39-14.21 57.04-14.21 26.65 0 34.13 14.21 57.43 13.78 23.78-.45 38.7-21.74 53.2-43.18 16.78-24.74 23.66-48.74 24.06-49.95-.53-.27-46.13-17.76-46.63-70.36zM275.07 90.05c12.05-14.72 20.21-34.93 17.99-55.18-17.32.73-39.06 11.84-51.53 26.47-11.05 12.85-20.85 33.79-18.27 53.55 19.39 1.5 39.31-9.85 51.81-24.84z"/>
    </svg>
  );
}
