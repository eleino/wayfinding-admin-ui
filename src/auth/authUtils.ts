import { jwtDecode } from "jwt-decode";

interface JWTType {
    exp: number;
    role: string;
}
export const isTokenValid = (token: string): boolean => {
  try {
    const { exp } = jwtDecode<JWTType>(token);
    return exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const getTokenExpirationDelay = (token: string): number => {
  try {
    const { exp } = jwtDecode<JWTType>(token);
    const expiresAfter = exp * 1000 - Date.now();
    return expiresAfter > 0 ? expiresAfter : 0;
  } catch {
    return 0;
  }
};

export const getUserRoleFromToken = (token: string): string | null => {
  try {
    const  { role } = jwtDecode<JWTType>(token);
    return role || null;
  } catch {
    return null;
  }
};

export function getIsAuthenticated(allowedRoles?: string[]): boolean {
  const token = localStorage.getItem("authToken");
  if (!token || !isTokenValid(token)) return false;
  if (allowedRoles) {
    const role = getUserRoleFromToken(token);
    return role !== null && allowedRoles.includes(role);
  }
  return true;
}