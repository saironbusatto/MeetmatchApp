import jwt from "jsonwebtoken";

type AccessClaims = {
  userId: string;
  email: string;
};

type TokenPayload = {
  sub: string;
  email: string;
};

const DEFAULT_EXPIRES_IN = "8h";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is required.");
  }
  return secret;
}

export function signAccessToken(claims: AccessClaims) {
  const secret = getJwtSecret();
  const payload = { email: claims.email };
  return jwt.sign(payload, secret, {
    algorithm: "HS256",
    subject: claims.userId,
    expiresIn: (process.env.JWT_EXPIRES_IN ?? DEFAULT_EXPIRES_IN) as string | number,
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): TokenPayload {
  const secret = getJwtSecret();
  const decoded = jwt.verify(token, secret, { algorithms: ["HS256"] }) as jwt.JwtPayload;
  if (!decoded.sub || typeof decoded.sub !== "string") {
    throw new Error("Invalid token subject");
  }

  return {
    sub: decoded.sub,
    email: typeof decoded.email === "string" ? decoded.email : ""
  };
}

