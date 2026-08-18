import { useContext, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AuthContext } from "@auth/authContext";
import { type DraftKind, type SavedDraft, useDraftStore } from "@storage/drafts";

export const DraftBanner = (props: { kinds?: DraftKind[] }) => {
  const { kinds } = props;
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();
  const dismissDraft = useDraftStore((state) => state.dismissDraft);
  const userDrafts = useDraftStore((state) =>
    userId ? state.draftsByUser[userId] : undefined,
  );
  const draft = useMemo(
    () =>
      Object.values(userDrafts ?? {})
      .filter((candidate): candidate is SavedDraft =>
        !!candidate && (!kinds || kinds.includes(candidate.kind)),
      )
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0],
    [kinds, userDrafts],
  );
  const updatedAt = useMemo(
    () => (draft ? new Date(draft.updatedAt).toLocaleString() : ""),
    [draft],
  );

  if (!draft || !userId) return null;

  return (
    <div className="mb-4 flex items-center justify-between gap-4 rounded border border-lab-turquoise bg-sidebar-grey p-3">
      <div>
        <p className="font-semibold">Unsaved draft: {draft.label}</p>
        <p className="text-sm text-gray-400">Last saved locally {updatedAt}</p>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          className="rounded bg-lab-green-dark px-3 py-1 cursor-pointer"
          onClick={() =>
            navigate({
              to: draft.route,
              search:
                draft.kind === "path"
                  ? { ...draft.search, stepId: undefined }
                  : draft.search,
              replace: false,
            })
          }
        >
          Resume
        </button>
        <button
          type="button"
          className="rounded border border-border-grey px-3 py-1 cursor-pointer"
          onClick={() => dismissDraft(userId, draft.kind)}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};
