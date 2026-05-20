export interface EnvBindings {
  CORS_ORIGIN: string;
  JWT_SECRET: string;
}

export interface AuthContext {
  userId: string;
}

export type Variables = {
  auth?: AuthContext;
};
