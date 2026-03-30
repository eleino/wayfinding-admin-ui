import apiClient from "./client";
import type { LoginResultType } from "@apptypes/login-result";

export const apiLogin = async (username: string, password: string): Promise<LoginResultType> => {
  const response = await apiClient.post('auth/login', { json: { username, password } });
  return response.json();
}