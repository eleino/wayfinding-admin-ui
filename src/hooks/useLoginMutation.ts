import { useMutation } from "@tanstack/react-query";
import type { LoginResultType } from "@apptypes/login-result";
import { apiLogin } from "@api/login";
import { useContext } from "react";
import { AuthContext } from "@auth/authContext";

type LoginInput = { username: string; password: string };

export const useLoginMutation = () => {
  const { login } = useContext(AuthContext);
  const mutation = useMutation<LoginResultType, Error, LoginInput>({
    mutationFn: async ({ username, password }) => apiLogin(username, password),
    onSuccess: (data) => {
      login(data.accessToken);
    },
  });
  return mutation;
};
