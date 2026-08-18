import { createContext } from "react";

export interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string | null;
  userId: number | null;
  login: (token: string, userId?: number) => boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userRole: null,
  userId: null,
  login: () => false,
  logout: () => {},
});
