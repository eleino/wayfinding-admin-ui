import { useEffect, useId, type ReactNode } from "react";
import { createPortal } from "react-dom";

export const DeleteDialog = ({
  onConfirm,
  onCancel,
  itemName,
  title = "Confirm deletion",
  description,
  confirmLabel = "Delete",
  pendingLabel = "Deleting...",
  isPending = false,
  error,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  itemName: string;
  title?: string;
  description?: ReactNode;
  confirmLabel?: string;
  pendingLabel?: string;
  isPending?: boolean;
  error?: Error | null;
}) => {
  const titleId = useId();
  const descriptionId = useId();
  const errorId = useId();

  // allow closing the dialog with ESC key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isPending) onCancel();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isPending, onCancel]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isPending) onCancel();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={`${descriptionId}${error ? ` ${errorId}` : ""}`}
        className="w-full max-w-lg rounded-xl border border-border-grey bg-sidebar-grey p-6 shadow-2xl"
      >
        <h2 id={titleId} className="text-xl font-semibold">
          {title}
        </h2>
        <div id={descriptionId} className="mt-3 text-gray-200">
          {description ?? (
            <p>
              Are you sure you want to delete{" "}
              <strong className="break-all">{itemName}</strong>?
            </p>
          )}
        </div>
        {error && (
          <p id={errorId} className="mt-4 text-red-300" role="alert">
            {error.message || "The item could not be deleted. Please try again."}
          </p>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            autoFocus
            disabled={isPending}
            onClick={onCancel}
            className="cursor-pointer rounded border border-border-grey px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={onConfirm}
            className="cursor-pointer rounded bg-red-500 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? pendingLabel : confirmLabel}
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
};
