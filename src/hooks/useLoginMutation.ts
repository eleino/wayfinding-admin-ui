import { useMutation } from "@tanstack/react-query";
import type { LoginResultType } from "@apptypes/login-result";
import { apiLogin } from "@api/login";
import { useContext } from "react";
import { AuthContext } from "@auth/authContext";

type LoginInput = { username: string; password: string };

export const useLoginMutation = () => {
  const { login } = useContext(AuthContext);
  const mutation = useMutation<LoginResultType, Error, LoginInput>({
    mutationFn: async ({ username, password }) => {
      const data = await apiLogin(username, password);
      if (!login(data.accessToken)) {
        throw new Error("Your account is not authorized to use the admin interface.");
      }
      return data;
    },
  });
  return mutation;
};
