// Using localStorage for storing the token, http-only cookies would be preferred but that would require changes to the backend.
import React, { useCallback, useState, useRef, useEffect, useMemo } from "react";
import {
  getUserRoleFromToken,
  getTokenExpirationDelay,
  isTokenAuthorized,
} from "./authUtils";
import { AuthContext } from "./authContext";
import { useQueryClient } from "@tanstack/react-query";


interface AuthProviderProps {
  children: React.ReactNode;
}
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken && isTokenAuthorized(storedToken)) return storedToken;

    localStorage.removeItem("authToken");
    localStorage.removeItem("authUserId");
    return null;
  });
  const [userId, setUserId] = useState<number | null>(() => {
    const storedUserId = localStorage.getItem("authUserId");
    return storedUserId ? Number(storedUserId) : null;
  });
  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isAuthenticated = useMemo(
    () => !!token && isTokenAuthorized(token),
    [token],
  );
  const userRole = useMemo(() => (token ? getUserRoleFromToken(token) : null), [token]);

  const clearUserQueries = useCallback(() => {
    queryClient.removeQueries({ queryKey: ["users"] });
  }, [queryClient]);

  const login = useCallback((newToken: string, newUserId?: number) => {
    if (!isTokenAuthorized(newToken)) {
      console.warn("Attempted to login with an invalid token.");
      return false;
    }

    localStorage.setItem("authToken", newToken);
    if (newUserId !== undefined) {
      localStorage.setItem("authUserId", String(newUserId));
      setUserId(newUserId);
    }
    clearUserQueries();
    setToken(newToken);
    return true;
  }, [clearUserQueries]);

  const logout = useCallback(() => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUserId");
    clearUserQueries();
    setToken(null);
    setUserId(null);
  }, [clearUserQueries]);

  useEffect(() => {
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    if (token && isTokenAuthorized(token)) {
      const expirationDelay = getTokenExpirationDelay(token);
      logoutTimerRef.current = setTimeout(logout, expirationDelay);
    }

    return () => {
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    };
  }, [logout, token]);

  useEffect(() => {
    const syncAuthAcrossTabs = (event: StorageEvent) => {
      if (event.key !== "authToken") return;
      clearUserQueries();
      const nextToken = event.newValue && isTokenAuthorized(event.newValue) ? event.newValue : null;
      setToken(nextToken);
      setUserId(nextToken ? Number(localStorage.getItem("authUserId")) || null : null);
    };

    window.addEventListener("storage", syncAuthAcrossTabs);
    return () => window.removeEventListener("storage", syncAuthAcrossTabs);
  }, [clearUserQueries]);

  const value = useMemo(
    () => ({ isAuthenticated, userRole, userId, login, logout }),
    [isAuthenticated, userRole, userId, login, logout],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
