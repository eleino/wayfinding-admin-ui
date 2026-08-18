import { Field, Form, useForm } from "@formisch/react";
import type { User, UserRole } from "@apptypes/users";
import {
  CreateUserSchema,
  UpdateUserSchema,
  type CreateUserInput,
  type UpdateUserInput,
} from "@schemas/user.schema";

export type UserFormMode = "create" | "edit";

export interface UserFormValues {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

interface UserFormProps {
  mode: UserFormMode;
  user?: User;
  canEditRole: boolean;
  isPending: boolean;
  error?: string | null;
  onCancel: () => void;
  onSubmit: (values: UserFormValues) => Promise<void> | void;
}

const inputClassName = "rounded border border-border-grey bg-black p-2";

export const UserForm = ({
  mode,
  user,
  canEditRole,
  isPending,
  error,
  onCancel,
  onSubmit,
}: UserFormProps) => {
  const isCreate = mode === "create";
  const form = useForm({
    schema: isCreate ? CreateUserSchema : UpdateUserSchema,
    initialInput: {
      username: user?.username ?? "",
      email: user?.email ?? "",
      password: "",
      role: user?.role ?? "user",
    },
    validate: "blur",
  });

  const handleSubmit = async (values: CreateUserInput | UpdateUserInput) => {
    await onSubmit({
      username: values.username,
      email: values.email || "",
      password: values.password,
      role: values.role,
    });
  };

  return (
    <Form of={form} onSubmit={handleSubmit} className="space-y-4">
        <Field of={form} path={["username"]}>
          {(field) => (
            <label className="flex flex-col gap-1">
              <span>Username</span>
              <input {...field.props} value={field.input ?? ""} required autoComplete="username" className={inputClassName} onChange={(event) => field.onChange(event.target.value)} />
              {field.errors && <span className="text-red-300" role="alert">{field.errors[0]}</span>}
            </label>
          )}
        </Field>
      <Field of={form} path={["email"]}>
        {(field) => (
          <label className="flex flex-col gap-1">
            <span>Email</span>
            <input type="email" autoComplete="email" {...field.props} value={field.input ?? ""} required className={inputClassName} onChange={(event) => field.onChange(event.target.value)} />
            {field.errors && <span className="text-red-300" role="alert">{field.errors[0]}</span>}
          </label>
        )}
      </Field>
      <Field of={form} path={["password"]}>
        {(field) => (
          <label className="flex flex-col gap-1">
            <span>{isCreate ? "Password" : "New password (leave blank to keep the current password)"}</span>
            <input type="password" autoComplete="off" {...field.props} value={field.input ?? ""} required={isCreate} className={inputClassName} onChange={(event) => field.onChange(event.target.value)} />
            {field.errors && <span className="text-red-300" role="alert">{field.errors[0]}</span>}
          </label>
        )}
      </Field>
      {canEditRole && (
        <Field of={form} path={["role"]}>
          {(field) => (
            <label className="flex flex-col gap-1">
              <span>Role</span>
              <select {...field.props} value={field.input} className={inputClassName} onChange={(event) => field.onChange(event.target.value as UserRole)}>
                <option value="admin">Admin</option>
                <option value="maintainer">Maintainer</option>
                <option value="user">User</option>
              </select>
              {field.errors && <span className="text-red-300" role="alert">{field.errors[0]}</span>}
            </label>
          )}
        </Field>
      )}
      {error && <p className="text-red-300" role="alert">{error}</p>}
      <div className="flex justify-end gap-3">
        <button type="button" disabled={isPending} onClick={onCancel} className="cursor-pointer rounded border border-border-grey px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50">Cancel</button>
        <button type="submit" disabled={isPending} className="cursor-pointer rounded bg-lab-green-dark px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50">
          {isPending ? "Saving..." : isCreate ? "Create user" : "Save changes"}
        </button>
      </div>
    </Form>
  );
};
