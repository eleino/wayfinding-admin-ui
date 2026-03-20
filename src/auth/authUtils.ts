import { jwtDecode } from "jwt-decode";

interface JWTType {
    expiresIn: number;
    role: string;
}
export const isTokenValid = (token: string): boolean => {
  try {
    const { expiresIn } = jwtDecode<JWTType>(token);
    return expiresIn * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const getTokenExpirationDelay = (token: string): number => {
  try {
    const { expiresIn } = jwtDecode<JWTType>(token);
    const expiresAfter = expiresIn * 1000 - Date.now();
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