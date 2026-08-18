import apiClient from "./client";
import type {
  CreateUserRequest,
  UpdateUserRequest,
  User,
  UserRole,
  UsersList,
} from "@apptypes/users";

export interface UserListParams {
  page?: number;
  limit?: number;
  name?: string;
}

export const fetchUsers = async ({
  page = 1,
  limit = 100,
  name,
}: UserListParams = {}): Promise<UsersList> => {
  const response = await apiClient.get("users", {
    searchParams: { page, limit, ...(name ? { name } : {}) },
  });
  return response.json();
};

export const fetchCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get("users/me");
  return response.json();
};

export const createUser = async (user: CreateUserRequest): Promise<User> => {
  const response = await apiClient.post("users", { json: user });
  return response.json();
};

export const updateCurrentUser = async (
  user: UpdateUserRequest,
): Promise<User> => {
  const response = await apiClient.put("users/me", { json: user });
  return response.json();
};

export const updateUser = async (
  userId: number,
  user: UpdateUserRequest,
): Promise<User> => {
  const response = await apiClient.put(`users/${userId}`, { json: user });
  return response.json();
};

export const updateUserRole = async (
  userId: number,
  role: UserRole,
): Promise<User> => {
  const response = await apiClient.patch(`users/${userId}/role`, { json: { role } });
  return response.json();
};

export const deleteUser = async (userId: number): Promise<void> => {
  await apiClient.delete(`users/${userId}`);
};
