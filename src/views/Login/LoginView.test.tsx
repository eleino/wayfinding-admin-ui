import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContext } from "@auth/authContext";
import { AuthProvider } from "@auth/authProvider";
import { useContext, type ReactNode } from "react";
import { render } from "vitest-browser-react";
import { beforeEach, describe, expect, test } from "vitest";
import {
  adminToken,
  authRequests,
  resetAuthMockData,
} from "test/handlers/auth";
import { LoginView } from "./LoginView";

const AuthStatus = () => {
  const auth = useContext(AuthContext);
  return (
    <output aria-label="Authentication status">
      {auth.isAuthenticated ? `signed in as ${auth.userRole}` : "signed out"}
    </output>
  );
};

const TestProviders = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthStatus />
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
};

describe("LoginView", () => {
  beforeEach(resetAuthMockData);

  test("submits credentials and persists an authorized session", async () => {
    const screen = await render(<LoginView />, { wrapper: TestProviders });

    await screen.getByPlaceholder("Username").fill("admin");
    await screen.getByPlaceholder("Password").fill("secret");
    await screen.getByRole("button", { name: "Login" }).click();

    await expect.poll(() => authRequests.logins).toEqual([
      { username: "admin", password: "secret" },
    ]);
    await expect
      .element(screen.getByLabelText("Authentication status"))
      .toHaveTextContent("signed in as admin");
    expect(localStorage.getItem("authToken")).toBe(adminToken);
  });

  test("shows the backend message when credentials are rejected", async () => {
    const screen = await render(<LoginView />, { wrapper: TestProviders });

    await screen.getByPlaceholder("Username").fill("admin");
    await screen.getByPlaceholder("Password").fill("wrong");
    await screen.getByRole("button", { name: "Login" }).click();

    await expect
      .element(screen.getByText(/Invalid credentials/))
      .toBeInTheDocument();
    await expect
      .element(screen.getByLabelText("Authentication status"))
      .toHaveTextContent("signed out");
    expect(localStorage.getItem("authToken")).toBeNull();
  });

  test("rejects a valid token whose role cannot use the admin interface", async () => {
    const screen = await render(<LoginView />, { wrapper: TestProviders });

    await screen.getByPlaceholder("Username").fill("viewer");
    await screen.getByPlaceholder("Password").fill("secret");
    await screen.getByRole("button", { name: "Login" }).click();

    await expect
      .element(screen.getByText(/not authorized to use the admin interface/i))
      .toBeInTheDocument();
    await expect
      .element(screen.getByLabelText("Authentication status"))
      .toHaveTextContent("signed out");
    expect(localStorage.getItem("authToken")).toBeNull();
  });
});
