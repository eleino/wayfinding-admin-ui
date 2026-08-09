import {
  createMemoryHistory,
  createRouter,
} from "@tanstack/react-router";
import { describe, expect, it, vi } from "vitest";
import type { AuthContextType } from "@auth/authContext";
import { AppRouter } from "./AppRouter";

const createAuth = (isAuthenticated: boolean): AuthContextType => ({
  isAuthenticated,
  userRole: isAuthenticated ? "admin" : null,
  login: vi.fn(() => false),
  logout: vi.fn(),
});

const loadRoute = async (path: string, isAuthenticated: boolean) => {
  const router = createRouter({
    routeTree: AppRouter,
    history: createMemoryHistory({ initialEntries: [path] }),
    context: { auth: createAuth(isAuthenticated) },
  });

  await router.load();
  return router.state.redirect?.options.href ?? router.state.location.pathname;
};

describe("AppRouter authentication", () => {
  it("redirects anonymous users away from protected routes", async () => {
    await expect(loadRoute("/locations", false)).resolves.toBe("/login");
  });

  it("redirects authenticated users away from the login route", async () => {
    await expect(loadRoute("/login", true)).resolves.toBe("/dashboard");
  });

  it("redirects the authenticated home route to the dashboard", async () => {
    await expect(loadRoute("/", true)).resolves.toBe("/dashboard");
  });

  it("allows authenticated users to access protected routes", async () => {
    await expect(loadRoute("/settings", true)).resolves.toBe("/settings");
  });
});
