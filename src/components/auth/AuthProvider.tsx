"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { getMe, logout as logoutRequest } from "@/services/api";
import type { AuthPayload, AuthUser } from "@/types/platform";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  setSession: (payload: AuthPayload) => void;
  refreshUser: () => Promise<AuthUser | null>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "nara_auth_token";
const USER_KEY = "nara_auth_user";

function readStoredUser() {
  if (typeof window === "undefined") return null;

  const stored = window.localStorage.getItem(USER_KEY);

  if (!stored) return null;

  try {
    return JSON.parse(stored) as AuthUser;
  } catch {
    window.localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const setSession = useCallback((payload: AuthPayload) => {
    window.localStorage.setItem(TOKEN_KEY, payload.token);
    window.localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
    setToken(payload.token);
    setUser(payload.user);
  }, []);

  const refreshUser = useCallback(async () => {
    const activeToken = token ?? (typeof window !== "undefined" ? window.localStorage.getItem(TOKEN_KEY) : null);

    if (!activeToken) {
      if (typeof window !== "undefined") clearSession();
      return null;
    }

    try {
      const freshUser = await getMe(activeToken);
      window.localStorage.setItem(USER_KEY, JSON.stringify(freshUser));
      setToken(activeToken);
      setUser(freshUser);
      return freshUser;
    } catch {
      clearSession();
      return null;
    }
  }, [clearSession, token]);

  const logout = useCallback(async () => {
    const activeToken = token ?? window.localStorage.getItem(TOKEN_KEY);

    if (activeToken) {
      await logoutRequest(activeToken).catch(() => null);
    }

    clearSession();
  }, [clearSession, token]);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      const storedToken = window.localStorage.getItem(TOKEN_KEY);
      const storedUser = readStoredUser();

      if (storedToken) {
        setToken(storedToken);
        setUser(storedUser);

        try {
          const freshUser = await getMe(storedToken);

          if (!cancelled) {
            window.localStorage.setItem(USER_KEY, JSON.stringify(freshUser));
            setUser(freshUser);
          }
        } catch {
          if (!cancelled) clearSession();
        }
      }

      if (!cancelled) setLoading(false);
    }

    hydrate();

    return () => {
      cancelled = true;
    };
  }, [clearSession]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== TOKEN_KEY && event.key !== USER_KEY) return;

      const storedToken = window.localStorage.getItem(TOKEN_KEY);
      const storedUser = readStoredUser();

      setToken(storedToken);
      setUser(storedUser);
    };

    window.addEventListener("storage", onStorage);

    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token && user),
      setSession,
      refreshUser,
      logout,
    }),
    [loading, logout, refreshUser, setSession, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
