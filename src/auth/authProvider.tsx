// Using localStorage for storing the token, cookies would be preferred but that would require changes to the backend.
import React, { createContext, useState, useRef } from "react";
import {
  getUserRoleFromToken,
  isTokenValid,
  getTokenExpirationDelay,
} from "./authUtils";

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string | null;
  login: (token: string) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userRole: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem("authToken") || "";
    return isTokenValid(storedToken) ? storedToken : null;
  });
  const [userRole, setUserRole] = useState<string | null>(() => {
    return token ? getUserRoleFromToken(token) : null;
  });
  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const login = (token: string) => {
    if (isTokenValid(token)) {
      const expirationDelay = getTokenExpirationDelay(token);
      logoutTimerRef.current = setTimeout(() => {
        logout();
      }, expirationDelay);
      localStorage.setItem("authToken", token);
      setIsAuthenticated(true);
      setToken(token);
      setUserRole(getUserRoleFromToken(token));
    } else {
      console.warn("Attempted to login with an invalid token.");
    }
  };

  const logout = () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }
    setToken(null);
    setUserRole(null);
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
