import type { SearchParams } from "@schemas/router.schema";
import type { LocationDeletionImpact } from "@apptypes/location";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

export const LocationDeletionDialog = (props: {
  impact?: LocationDeletionImpact;
  isLoading: boolean;
  error?: Error | null;
  isDeleting: boolean;
  deleteError?: Error | null;
  searchParams: SearchParams;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  const {
    impact,
    isLoading,
    error,
    isDeleting,
    deleteError,
    searchParams,
    onConfirm,
    onCancel,
  } = props;
  const [confirmDeletePaths, setConfirmDeletePaths] = useState(false);

  const translationKeys = impact
    ? [
        ...new Set(
          impact.obsolete_resources.translations.map(
            (item) => item.translation_key,
          ),
        ),
      ]
    : [];
  const missingCount = impact
    ? impact.missing_resource_keys.images.length +
      impact.missing_resource_keys.translations.length +
      impact.missing_resource_keys.overlays.length
    : 0;

  const canDelete = impact?.affected_paths.length === 0 || confirmDeletePaths;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded border border-border-grey bg-sidebar-grey p-6 shadow-xl">
        <h2 className="text-xl font-bold text-red-400">
          Review location deletion
        </h2>

        {isLoading && <p className="mt-4">Calculating deletion impact...</p>}
        {error && (
          <p className="mt-4 text-red-400">
            Could not load deletion impact: {error.message}
          </p>
        )}

        {impact && (
          <div className="mt-4 flex flex-col gap-4">
            <p>
              Deleting <strong>{impact.location.name}</strong> cannot be undone.
              The entries below will also be removed.
            </p>

            <section>
              <h3 className="font-bold text-lab-turquoise">
                Affected paths ({impact.affected_paths.length})
              </h3>
              {impact.affected_paths.length ? (
                <ul className="mt-1 list-inside list-disc">
                  {impact.affected_paths.map((path) => (
                    <li key={path.path_id}>
                      {path.name}{" "}
                      <Link
                        className="text-lab-green-dark underline"
                        to="/paths/edit"
                        search={{ ...searchParams, pathId: path.path_id, locationId: undefined }}
                        onClick={onCancel}
                      >
                        Edit path
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-300">No paths will be deleted.</p>
              )}
            </section>

            <div className="grid gap-4 md:grid-cols-3">
              <ImpactList
                title="Images"
                items={impact.obsolete_resources.images.map(
                  (item) => item.image_key,
                )}
              />
              <ImpactList title="Translations" items={translationKeys} />
              <ImpactList
                title="Overlays"
                items={impact.obsolete_resources.overlays.map(
                  (item) => item.overlay_key,
                )}
              />
            </div>

            {(impact.cascade_counts.feedback > 0 ||
              impact.cascade_counts.metrics > 0 ||
              impact.cascade_counts.organization_paths > 0) && (
              <p className="text-sm text-gray-300">
                Path deletion also removes{" "}
                {impact.cascade_counts.organization_paths} organization
                associations, {impact.cascade_counts.feedback} feedback entries,
                and {impact.cascade_counts.metrics} metric entries.
              </p>
            )}

            {missingCount > 0 && (
              <p className="text-sm text-amber-300">
                {missingCount} referenced resource{" "}
                {missingCount === 1 ? "entry is" : "entries are"} already
                missing. This will not prevent deletion.
              </p>
            )}
            {impact.affected_paths.length > 0 && (
              <div className="flex items-center gap-2 border border-red-400 p-2">
                <input
                  type="checkbox"
                  id="confirm-delete-paths"
                  checked={confirmDeletePaths}
                  onChange={(e) => setConfirmDeletePaths(e.target.checked)}
                />
                <label
                  htmlFor="confirm-delete-paths"
                  className="text-sm text-red-400"
                >
                  Yes, I want to delete this location and{" "}
                  {impact.affected_paths.length} path
                  {impact.affected_paths.length === 1 ? "" : "s"}.
                </label>
              </div>
            )}

            {deleteError && (
              <p className="text-red-400">
                Deletion failed: {deleteError.message}
              </p>
            )}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="cursor-pointer rounded bg-border-grey px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={
              !impact || isLoading || Boolean(error) || isDeleting || !canDelete
            }
            className="cursor-pointer rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting
              ? "Deleting..."
              : impact?.affected_paths.length
                ? `Delete location and ${impact.affected_paths.length} path${impact.affected_paths.length === 1 ? "" : "s"}`
                : "Delete location"}
          </button>
        </div>
      </div>
    </div>
  );
};

const ImpactList = (props: { title: string; items: string[] }) => (
  <section>
    <h3 className="font-bold text-lab-turquoise">
      {props.title} ({props.items.length})
    </h3>
    {props.items.length ? (
      <ul className="mt-1 max-h-40 overflow-y-auto text-sm text-gray-300">
        {props.items.map((item) => (
          <li className="break-all" key={item}>
            {item}
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-sm text-gray-300">None</p>
    )}
  </section>
);
