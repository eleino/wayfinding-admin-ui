import * as v from "valibot";
import { userRoles } from "@apptypes/users";

const usernameSchema = v.pipe(
  v.string(),
  v.nonEmpty("Username is required"),
  v.maxLength(50, "Username must be 50 characters or fewer"),
);

const emailSchema = v.pipe(v.string(), v.email("Enter a valid email address"));

const passwordSchema = v.pipe(
  v.string(),
  v.minLength(8, "Password must be at least 8 characters"),
  v.regex(/[A-Z]/, "Password must contain an uppercase letter"),
  v.regex(/[a-z]/, "Password must contain a lowercase letter"),
  v.regex(/\d/, "Password must contain a number"),
);

const optionalPasswordSchema = v.union([v.literal(""), passwordSchema]);

export const CreateUserSchema = v.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
  role: v.picklist(userRoles, "Select a valid role"),
});

export const UpdateUserSchema = v.object({
  username: usernameSchema,
  email: emailSchema,
  password: optionalPasswordSchema,
  role: v.picklist(userRoles, "Select a valid role"),
});

export type CreateUserInput = v.InferOutput<typeof CreateUserSchema>;
export type UpdateUserInput = v.InferOutput<typeof UpdateUserSchema>;
