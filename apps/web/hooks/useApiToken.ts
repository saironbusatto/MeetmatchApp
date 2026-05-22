"use client";

import { useAuth } from "@clerk/nextjs";

// Retorna uma função que busca o token do Clerk pra usar em requests ao backend.
// Uso: const getToken = useApiToken();
//      const res = await fetch(url, { headers: { Authorization: `Bearer ${await getToken()}` } });
export function useApiToken() {
  const { getToken } = useAuth();
  return getToken;
}
