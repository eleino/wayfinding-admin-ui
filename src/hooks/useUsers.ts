import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createUser,
  deleteUser,
  fetchCurrentUser,
  fetchUsers,
  updateCurrentUser,
  updateUser,
  updateUserRole,
  type UserListParams,
} from "@api/users";
import type {
  CreateUserRequest,
  UpdateUserRequest,
  UserRole,
} from "@apptypes/users";

const usersQueryKey = ["users"] as const;
const currentUserQueryKey = ["users", "me"] as const;

export const useGetUsers = (params: UserListParams = {}) =>
  useQuery({
    queryKey: [...usersQueryKey, params],
    queryFn: () => fetchUsers(params),
  });

export const useGetCurrentUser = () =>
  useQuery({ queryKey: currentUserQueryKey, queryFn: fetchCurrentUser });

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: CreateUserRequest) => createUser(user),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: usersQueryKey }),
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      user,
      isSelf,
    }: {
      userId: number;
      user: UpdateUserRequest;
      isSelf: boolean;
    }) => (isSelf ? updateCurrentUser(user) : updateUser(userId, user)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: usersQueryKey }),
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: UserRole }) =>
      updateUserRole(userId, role),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: usersQueryKey }),
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: usersQueryKey }),
  });
};
