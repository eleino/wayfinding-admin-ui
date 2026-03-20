import { jwtDecode } from "jwt-decode";

// interface JWTType {
//     exp: number;
// }
// export const isTokenValid = (token: string): boolean => {
//   try {
//     const { exp } = jwtDecode<JWTType>(token);
//     return exp * 1000 > Date.now();
//   } catch {
//     return false;
//   }
// };

export const getUserRoleFromToken = (token: string): string | null => {
  try {
    const decoded: { role?: string } = jwtDecode(token);
    return decoded.role || null;
  } catch {
    return null;
  }
};