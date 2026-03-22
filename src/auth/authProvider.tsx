// Using localStorage for storing the token, cookies would be preferred but that would require changes to the backend.
import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  getUserRoleFromToken,
  isTokenValid,
  getTokenExpirationDelay,
} from "./authUtils";
import { AuthContext } from "./authContext";


interface AuthProviderProps {
  children: React.ReactNode;
}
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem("authToken") || "";
    return isTokenValid(storedToken) ? storedToken : null;
  });
  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const isAuthenticated = useMemo(() => !!token && isTokenValid(token), [token]);
  const userRole = useMemo(() => (token ? getUserRoleFromToken(token) : null), [token]);


  const login = (token: string) => {
    if (isTokenValid(token)) {
      localStorage.setItem("authToken", token);
      setToken(token);
      console.log("User logged in successfully.");
    } else {
      console.warn("Attempted to login with an invalid token.");
    }
  };

  const logout = () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }
    setToken(null);
    localStorage.removeItem("authToken");
  };

  useEffect(() => {
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    if (token && isTokenValid(token)) {
      const expirationDelay = getTokenExpirationDelay(token);
      logoutTimerRef.current = setTimeout(() => {
        logout();
      }, expirationDelay);
    }
    
  }, [token]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
