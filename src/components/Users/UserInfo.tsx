import type { User } from "@apptypes/users";

interface UserInfoProps {
  user?: User;
  isLoading: boolean;
  error: Error | null;
  onEdit: () => void;
}

export const UserInfo = ({ user, isLoading, error, onEdit }: UserInfoProps) => {
  if (isLoading) return <p>Loading your profile...</p>;
  if (error) return <p role="alert">Could not load your profile: {error.message}</p>;
  if (!user) return null;

  return (
    <section aria-labelledby="your-profile-heading" className=" max-w-3xl rounded border border-border-grey bg-sidebar-grey p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="your-profile-heading" className="text-xl font-semibold">Your profile</h2>
        <button
          type="button"
          onClick={onEdit}
          className="cursor-pointer rounded bg-lab-blue px-4 py-2 text-white"
        >
          Edit profile
        </button>
      </div>
      <dl className="mt-4 w-full grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)] items-center">
        <div><dt className="text-sm text-gray-400">Username</dt><dd>{user.username}</dd></div>
        <div className="min-w-0"><dt className="text-sm text-gray-400">Email</dt><dd className="truncate">{user.email || "Not set"}</dd></div>
        <div><dt className="text-sm text-gray-400">Role</dt><dd className="capitalize">{user.role}</dd></div>
      </dl>
    </section>
  );
};
