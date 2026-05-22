"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

// Clerk redireciona aqui após OAuth — ele finaliza o handshake e
// manda o usuário pra redirectUrlComplete (/dashboard).
export default function SSOCallbackPage() {
  return <AuthenticateWithRedirectCallback />;
}
