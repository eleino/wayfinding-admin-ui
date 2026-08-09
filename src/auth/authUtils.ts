import { jwtDecode } from "jwt-decode";

interface JWTType {
    exp: number;
    role: string;
}

export const ADMIN_ROLES = ["admin", "maintainer"] as const;

export const isTokenValid = (token: string): boolean => {
  try {
    const { exp } = jwtDecode<JWTType>(token);
    return exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const isTokenAuthorized = (
  token: string,
  allowedRoles: readonly string[] = ADMIN_ROLES,
): boolean => {
  if (!isTokenValid(token)) return false;

  const role = getUserRoleFromToken(token);
  return role !== null && allowedRoles.includes(role);
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
