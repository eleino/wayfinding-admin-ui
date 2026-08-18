import { useState } from "react";
import { DeleteDialog } from "@components/Forms/DeleteDialog";
import { UserForm, type UserFormValues } from "@components/Users/UserForm";
import { UserInfo } from "@components/Users/UserInfo";
import { UserList } from "@components/Users/UserList";
import {
  useCreateUser,
  useDeleteUser,
  useGetCurrentUser,
  useUpdateUser,
  useUpdateUserRole,
} from "@hooks/useUsers";
import type { User } from "@apptypes/users";

type FormTarget =
  | { mode: "create" }
  | { mode: "edit"; user: User }
  | null;

const errorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

const UsersView = () => {
  const currentUser = useGetCurrentUser();
  const isAdmin = currentUser.data?.role === "admin";
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const updateUserRole = useUpdateUserRole();
  const deleteUser = useDeleteUser();
  const [formTarget, setFormTarget] = useState<FormTarget>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const closeForm = () => {
    if (createUser.isPending || updateUser.isPending || updateUserRole.isPending) return;
    setFormTarget(null);
    setFormError(null);
  };

  const submitForm = async (values: UserFormValues) => {
    if (!formTarget) return;
    setFormError(null);

    try {
      if (formTarget.mode === "create") {
        await createUser.mutateAsync(values);
      } else {
        const isSelf = formTarget.user.id === currentUser.data?.id;
        await updateUser.mutateAsync({
          userId: formTarget.user.id,
          isSelf,
          user: {
            username: values.username,
            email: values.email,
            ...(values.password ? { password: values.password } : {}),
          },
        });
        if (isAdmin && values.role !== formTarget.user.role) {
          await updateUserRole.mutateAsync({
            userId: formTarget.user.id,
            role: values.role,
          });
        }
      }
      closeForm();
    } catch (error) {
      setFormError(errorMessage(error, "The user could not be saved."));
    }
  };

  const formUser = formTarget?.mode === "edit" ? formTarget.user : undefined;
  const isSaving = createUser.isPending || updateUser.isPending || updateUserRole.isPending;

  return (
    <div className="max-w-5xl p-5">
      <h1>Users</h1>
      <UserInfo
        user={currentUser.data}
        isLoading={currentUser.isLoading}
        error={currentUser.error}
        onEdit={() => {
          if (currentUser.data) {
            setFormError(null);
            setFormTarget({ mode: "edit", user: currentUser.data });
          }
        }}
      />
      {formTarget && (
        <section aria-labelledby="user-form-heading" className="mt-6 max-w-xl rounded border border-border-grey p-4">
          <h2 id="user-form-heading" className="mb-4 text-xl font-semibold">
            {formTarget.mode === "create"
              ? "Create user"
              : formTarget.user.id === currentUser.data?.id
                ? "Edit your profile"
                : `Edit ${formTarget.user.username}`}
          </h2>
          <UserForm
            mode={formTarget.mode}
            user={formUser}
            canEditRole={isAdmin}
            isPending={isSaving}
            error={formError}
            onCancel={closeForm}
            onSubmit={submitForm}
          />
        </section>
      )}
      {isAdmin && (
        <UserList
          onCreate={() => { setFormError(null); setFormTarget({ mode: "create" }); }}
          onEdit={(user) => { setFormError(null); setFormTarget({ mode: "edit", user }); }}
          onDelete={setUserToDelete}
        />
      )}
      {userToDelete && (
        <DeleteDialog
          itemName={userToDelete.username}
          title="Delete user"
          description={<p>Are you sure you want to delete <strong>{userToDelete.username}</strong>? This cannot be undone.</p>}
          isPending={deleteUser.isPending}
          error={deleteUser.error}
          onCancel={() => { if (!deleteUser.isPending) setUserToDelete(null); }}
          onConfirm={() => deleteUser.mutate(userToDelete.id, { onSuccess: () => setUserToDelete(null) })}
        />
      )}
    </div>
  );
};

export default UsersView;
