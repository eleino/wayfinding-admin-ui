import { describe, expect, it } from "vitest";
import { isTokenAuthorized, isTokenValid } from "./authUtils";

const createToken = (role: string, expiresAt: number) => {
  const encode = (value: object) =>
    btoa(JSON.stringify(value))
      .replaceAll("+", "-")
      .replaceAll("/", "_")
      .replaceAll("=", "");

  return `${encode({ alg: "none", typ: "JWT" })}.${encode({ role, exp: expiresAt })}.signature`;
};

describe("authUtils", () => {
  it("accepts unexpired tokens", () => {
    const token = createToken("user", Math.floor(Date.now() / 1000) + 60);

    expect(isTokenValid(token)).toBe(true);
  });

  it.each(["admin", "maintainer"])(
    "authorizes the %s role for the admin interface",
    (role) => {
      const token = createToken(role, Math.floor(Date.now() / 1000) + 60);

      expect(isTokenAuthorized(token)).toBe(true);
    },
  );

  it("rejects valid tokens with a non-admin role", () => {
    const token = createToken("user", Math.floor(Date.now() / 1000) + 60);

    expect(isTokenAuthorized(token)).toBe(false);
  });

  it("rejects expired and malformed tokens", () => {
    const expiredToken = createToken(
      "admin",
      Math.floor(Date.now() / 1000) - 60,
    );

    expect(isTokenAuthorized(expiredToken)).toBe(false);
    expect(isTokenAuthorized("not-a-token")).toBe(false);
  });
});
