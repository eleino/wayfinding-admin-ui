import { createContext } from "react";
interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userRole: null,
  login: () => {},
  logout: () => {},
});