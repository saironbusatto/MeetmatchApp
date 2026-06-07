"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import type { JSX } from "react";

// Clerk redireciona aqui após OAuth — ele finaliza o handshake e
// manda o usuário pra redirectUrlComplete (/dashboard).
export default function SSOCallbackPage(): JSX.Element {
  return <AuthenticateWithRedirectCallback />;
}
