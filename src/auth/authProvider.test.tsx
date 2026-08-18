import { useContext } from "react";
import { render } from "vitest-browser-react";
import { describe, expect, test } from "vitest";
import { adminToken, viewerToken } from "test/handlers/auth";
import { AuthContext } from "./authContext";
import { AuthProvider } from "./authProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const AuthStatus = () => {
  const { isAuthenticated, userRole, logout } = useContext(AuthContext);
  return (
    <>
      <output aria-label="Authentication status">
        {isAuthenticated ? `signed in as ${userRole}` : "signed out"}
      </output>
      <button type="button" onClick={logout}>Logout</button>
    </>
  );
};

describe("AuthProvider", () => {
  test("restores an authorized session and synchronizes logout across tabs", async () => {
    localStorage.setItem("authToken", adminToken);
    const queryClient = new QueryClient();
    queryClient.setQueryData(["users", "me"], { id: 1, role: "admin" });
    const screen = await render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AuthStatus />
        </AuthProvider>
      </QueryClientProvider>,
    );

    await expect
      .element(screen.getByLabelText("Authentication status"))
      .toHaveTextContent("signed in as admin");

    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "authToken",
        oldValue: adminToken,
        newValue: null,
      }),
    );

    await expect
      .element(screen.getByLabelText("Authentication status"))
      .toHaveTextContent("signed out");
    expect(queryClient.getQueryData(["users", "me"])).toBeUndefined();
  });

  test("removes a stored token for a role without admin access", async () => {
    localStorage.setItem("authToken", viewerToken);
    const queryClient = new QueryClient();
    const screen = await render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AuthStatus />
        </AuthProvider>
      </QueryClientProvider>,
    );

    await expect
      .element(screen.getByLabelText("Authentication status"))
      .toHaveTextContent("signed out");
    expect(localStorage.getItem("authToken")).toBeNull();
  });

  test("clears cached user data on logout", async () => {
    localStorage.setItem("authToken", adminToken);
    const queryClient = new QueryClient();
    queryClient.setQueryData(["users", "me"], { id: 1, role: "admin" });
    const screen = await render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AuthStatus />
        </AuthProvider>
      </QueryClientProvider>,
    );

    await screen.getByRole("button", { name: "Logout" }).click();

    expect(queryClient.getQueryData(["users", "me"])).toBeUndefined();
    await expect
      .element(screen.getByLabelText("Authentication status"))
      .toHaveTextContent("signed out");
  });
});
