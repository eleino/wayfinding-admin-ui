import { createContext } from "react";

export interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string | null;
  login: (token: string) => boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userRole: null,
  login: () => false,
  logout: () => {},
});
