import { createRemoteJWKSet, jwtVerify } from "jose";

// Clerk publica as chaves públicas nesse endpoint — derivado do publishable key.
// pk_test_cmlnaHQtY2hvdy0xMy5jbGVyay5hY2NvdW50cy5kZXYk decodifica pra:
// right-chow-13.clerk.accounts.dev
function getClerkJwksUrl(): string {
  const pk = process.env.CLERK_PUBLISHABLE_KEY ?? "";
  // Formato: pk_test_<base64(domain)> ou pk_live_<base64(domain)>
  const b64 = pk.replace(/^pk_(test|live)_/, "").replace(/\$+$/, "");
  let domain: string;
  try {
    domain = atob(b64);
    // Remove trailing null chars se houver
    domain = domain.replace(/\0/g, "").trim();
  } catch {
    throw new Error("Invalid CLERK_PUBLISHABLE_KEY format");
  }
  return `https://${domain}/.well-known/jwks.json`;
}

// Cache do JWKS — jose cuida do refresh automático
let _jwks: ReturnType<typeof createRemoteJWKSet> | null = null;
function getJwks() {
  if (!_jwks) {
    _jwks = createRemoteJWKSet(new URL(getClerkJwksUrl()));
  }
  return _jwks;
}

export async function verifyClerkToken(token: string): Promise<string> {
  const { payload } = await jwtVerify(token, getJwks(), {
    // Clerk usa RS256 nos JWTs de sessão
    algorithms: ["RS256"],
  });

  const sub = payload.sub;
  if (!sub) throw new Error("Token has no subject");
  return sub; // Clerk user ID (ex: user_2abc...)
}

// ── Mantido apenas para rotas legadas que ainda usam JWT próprio ──
// Pode remover quando todas as rotas migrarem para Clerk.
import jwt from "jsonwebtoken";

type AccessClaims = { userId: string; email: string };
type TokenPayload  = { sub: string; email: string };

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is required.");
  return secret;
}

export function signAccessToken(claims: AccessClaims) {
  return jwt.sign({ email: claims.email }, getJwtSecret(), {
    algorithm: "HS256",
    subject: claims.userId,
    expiresIn: (process.env.JWT_EXPIRES_IN ?? "8h") as jwt.SignOptions["expiresIn"],
  });
}

export function verifyAccessToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, getJwtSecret(), { algorithms: ["HS256"] }) as jwt.JwtPayload;
  if (!decoded.sub || typeof decoded.sub !== "string") throw new Error("Invalid token subject");
  return { sub: decoded.sub, email: typeof decoded.email === "string" ? decoded.email : "" };
}
