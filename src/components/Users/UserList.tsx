import { useState } from "react";
import { useGetUsers } from "@hooks/useUsers";
import type { User } from "@apptypes/users";
import { DataList, type DataListColumn } from "@components/List/DataList";

interface UserListProps {
  onCreate: () => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

// The users endpoint is admin-only. Keeping the query in this component means
// it is never requested for maintainers using the profile-only screen.
export const UserList = ({ onCreate, onEdit, onDelete }: UserListProps) => {
  const [search, setSearch] = useState("");
  const users = useGetUsers({ name: search.trim() || undefined });
  const columns: DataListColumn<User>[] = [
    { key: "username", label: "Username", width: "2fr" },
    {
      key: "email",
      label: "Email",
      width: "3fr",
      render: (user) => user.email || "Not set",
    },
    {
      key: "role",
      label: "Role",
      width: "1fr",
      render: (user) => <span className="capitalize">{user.role}</span>,
    },
    {
      key: "id",
      label: "Actions",
      width: "10rem",
      render: (user) => (
        <div className="flex justify-start gap-4">
          <button
            type="button"
            onClick={() => onEdit(user)}
            className="cursor-pointer text-lab-green-dark hover:underline"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(user)}
            className="cursor-pointer text-red-400 hover:underline"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <section aria-labelledby="user-list-heading" className="mt-8">
      <div className="flex flex-wrap items-center gap-5">
        <h2 id="user-list-heading" className="text-xl font-semibold">User management</h2>
        <button type="button" onClick={onCreate} className="cursor-pointer rounded bg-lab-blue px-4 py-2 text-white">New user</button>
      </div>
      <label className="mt-4 flex max-w-md flex-col gap-1">
        <span className="text-sm">Search by username</span>
        <input value={search} onChange={(event) => setSearch(event.target.value)} className="rounded border border-border-grey bg-black p-2" placeholder="Search users" />
      </label>
      {users.isLoading && <p className="mt-4">Loading users...</p>}
      {users.isError && <p className="mt-4 text-red-300" role="alert">Could not load users: {users.error.message}</p>}
      {users.data && (
        <>
          <p className="mt-4 text-sm text-gray-400">{users.data.meta.users.total} user{users.data.meta.users.total === 1 ? "" : "s"}</p>
          <DataList data={users.data.data} columns={columns} />
        </>
      )}
    </section>
  );
};
