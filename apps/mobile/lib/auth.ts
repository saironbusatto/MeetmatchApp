// Auth é gerenciada pelo Clerk via @clerk/expo.
// Use os hooks do Clerk nos componentes:
//   useAuth()   → { getToken, isSignedIn, userId }
//   useUser()   → { user }
//   useClerk()  → { signOut }
//
// Para requests ao backend Oracle:
//   const { getToken } = useAuth();
//   const token = await getToken();
//   fetch(url, { headers: { Authorization: `Bearer ${token}` } })

import * as SecureStore from "expo-secure-store";

// SecureStore adapter mantido para persistir o token do Clerk entre sessões.
export const clerkTokenCache = {
  async getToken(key: string) {
    return SecureStore.getItemAsync(key);
  },
  async saveToken(key: string, value: string) {
    return SecureStore.setItemAsync(key, value);
  },
  async clearToken(key: string) {
    return SecureStore.deleteItemAsync(key);
  },
};

// ── Invite token helpers (mantidos — não dependem de Supabase) ──────────────

export const INVITE_TOKEN_KEY = "farmei.invite_token";
const INVITE_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

type StoredInvite = { token: string; expiresAt: number };

function parseStored(raw: string | null): StoredInvite | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<StoredInvite>;
    if (typeof parsed.token === "string" && typeof parsed.expiresAt === "number") {
      return { token: parsed.token, expiresAt: parsed.expiresAt };
    }
  } catch {
    // formato antigo — descartar
  }
  return null;
}

export async function rememberInviteToken(token: string, ttlMs = INVITE_TOKEN_TTL_MS) {
  const payload: StoredInvite = { token, expiresAt: Date.now() + ttlMs };
  await SecureStore.setItemAsync(INVITE_TOKEN_KEY, JSON.stringify(payload));
}

export async function readInviteToken(): Promise<string | null> {
  const raw = await SecureStore.getItemAsync(INVITE_TOKEN_KEY);
  const stored = parseStored(raw);
  if (!stored) {
    if (raw) await SecureStore.deleteItemAsync(INVITE_TOKEN_KEY).catch(() => undefined);
    return null;
  }
  if (stored.expiresAt <= Date.now()) {
    await SecureStore.deleteItemAsync(INVITE_TOKEN_KEY).catch(() => undefined);
    return null;
  }
  return stored.token;
}

export async function clearInviteToken() {
  await SecureStore.deleteItemAsync(INVITE_TOKEN_KEY);
}
