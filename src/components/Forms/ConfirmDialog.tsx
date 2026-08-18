import { useEffect, useId } from "react";
import { createPortal } from "react-dom";

export const ConfirmDialog = (props: {
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  const { title, description, confirmLabel, onConfirm, onCancel } = props;
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="w-full max-w-lg rounded-xl border border-border-grey bg-sidebar-grey p-6 shadow-2xl"
      >
        <h2 id={titleId} className="text-xl font-semibold">
          {title}
        </h2>
        <p id={descriptionId} className="mt-3 text-gray-200">
          {description}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            autoFocus
            onClick={onCancel}
            className="cursor-pointer rounded border border-border-grey px-4 py-2"
          >
            Keep editing
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="cursor-pointer rounded bg-red-500 px-4 py-2 text-white"
          >
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
};
