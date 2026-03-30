// LoginView.tsx

import { useState } from "react";
import { useLoginMutation } from "@hooks/useLoginMutation";
import { useNavigate } from "@tanstack/react-router";

export const LoginView = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginMutation = useLoginMutation();

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    loginMutation.mutate(
      { username, password },
      { onSuccess: () => navigate({ to: "/" }) },
    );
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
              className="w-half p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
