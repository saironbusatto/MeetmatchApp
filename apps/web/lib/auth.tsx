"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type User = { id: string; name: string; email: string };

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("farmei_token");
    const storedUser = localStorage.getItem("farmei_user");
    if (storedToken) setToken(storedToken);
    if (storedUser) setUser(JSON.parse(storedUser));
    setIsLoading(false);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    token,
    isLoading,
    login(nextToken, nextUser) {
      setToken(nextToken);
      setUser(nextUser);
      localStorage.setItem("farmei_token", nextToken);
      localStorage.setItem("farmei_user", JSON.stringify(nextUser));
      document.cookie = `farmei_token=${nextToken}; path=/`;
    },
    logout() {
      setToken(null);
      setUser(null);
      localStorage.removeItem("farmei_token");
      localStorage.removeItem("farmei_user");
      document.cookie = "farmei_token=; Max-Age=0; path=/";
    }
  }), [user, token, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
