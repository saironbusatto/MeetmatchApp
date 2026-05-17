export interface EnvBindings {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  CORS_ORIGIN: string;
}

export interface AuthContext {
  userId: string;
}

export type Variables = {
  auth?: AuthContext;
};
