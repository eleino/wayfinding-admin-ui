import { useContext } from "react";
import { render } from "vitest-browser-react";
import { describe, expect, test } from "vitest";
import { adminToken, viewerToken } from "test/handlers/auth";
import { AuthContext } from "./authContext";
import { AuthProvider } from "./authProvider";

const AuthStatus = () => {
  const { isAuthenticated, userRole } = useContext(AuthContext);
  return (
    <output aria-label="Authentication status">
      {isAuthenticated ? `signed in as ${userRole}` : "signed out"}
    </output>
  );
};

describe("AuthProvider", () => {
  test("restores an authorized session and synchronizes logout across tabs", async () => {
    localStorage.setItem("authToken", adminToken);
    const screen = await render(
      <AuthProvider>
        <AuthStatus />
      </AuthProvider>,
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
  });

  test("removes a stored token for a role without admin access", async () => {
    localStorage.setItem("authToken", viewerToken);
    const screen = await render(
      <AuthProvider>
        <AuthStatus />
      </AuthProvider>,
    );

    await expect
      .element(screen.getByLabelText("Authentication status"))
      .toHaveTextContent("signed out");
    expect(localStorage.getItem("authToken")).toBeNull();
  });
});
