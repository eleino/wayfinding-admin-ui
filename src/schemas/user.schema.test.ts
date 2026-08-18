import * as v from "valibot";
import { describe, expect, it } from "vitest";
import { CreateUserSchema, UpdateUserSchema } from "./user.schema";

const validUser = {
  username: "janedoe",
  email: "jane@example.com",
  password: "Password1",
  role: "maintainer",
} as const;

describe("user schemas", () => {
  it("accepts a create request that satisfies the backend password requirements", () => {
    expect(v.safeParse(CreateUserSchema, validUser).success).toBe(true);
  });

  it("rejects a weak password and an invalid role", () => {
    expect(
      v.safeParse(CreateUserSchema, { ...validUser, password: "password" }).success,
    ).toBe(false);
    expect(
      v.safeParse(CreateUserSchema, { ...validUser, role: "super-admin" }).success,
    ).toBe(false);
  });

  it("allows an edit to leave the password blank", () => {
    expect(
      v.safeParse(UpdateUserSchema, { ...validUser, password: "" }).success,
    ).toBe(true);
  });
});
