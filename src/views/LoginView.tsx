// LoginView.tsx

import { useContext, useState } from "react";
import { AuthContext } from "@auth/authContext";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import type { LoginResultType } from "@apptypes/login-result";
import { apiLogin } from "@api/login";

type LoginInput = { username: string; password: string };

export const LoginView = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutation<LoginResultType, Error, LoginInput>({
    mutationFn: async ({ username, password }) => apiLogin(username, password),
    onSuccess: (data) => {
      login(data.accessToken);
      navigate({ to: "/" });
    },
  });

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate({ username, password });
  };

  return (
    <div>
      <div className="login-form">
        <form onSubmit={handleSubmit}>
          <div className="login-form-group flex flex-col items-center">
            <h1>Wayfinding Admin Login</h1>
            <input
              type="text"
              placeholder="Username"
              className="w-half p-2 mb-4 border border-gray-300 rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-half p-2 mb-4 border border-gray-300 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
