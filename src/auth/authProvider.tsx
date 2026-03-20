// Using localStorage for storing the token, cookies would be preferred but that would require changes to the backend.
import React, { createContext, useState } from 'react';
import { getUserRoleFromToken } from './authUtils';

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
  const [token, setToken] = useState<string | null>(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setIsAuthenticated(true);
      return storedToken;
    }
    return null;
  });
  const [userRole, setUserRole] = useState<string | null>(() => {
    if (token) {
      setIsAuthenticated(true);
      return getUserRoleFromToken(token);
    }
    return null;
  });

  const login = (token: string) => {
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
    setToken(token);
    setUserRole(getUserRoleFromToken(token));
  };

  const logout = () => {
    setToken(null);
    setUserRole(null);
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
