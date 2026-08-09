import type { ReactNode } from "react";

export const TranslationModal = ({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
    onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}
  >
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="translation-modal-title"
      className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-border-grey bg-sidebar-grey p-6 shadow-2xl"
    >
      <div className="flex items-start justify-between gap-4">
        <h2 id="translation-modal-title" className="text-2xl font-semibold">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="h-9 w-9 cursor-pointer rounded border border-border-grey text-xl hover:border-lab-turquoise hover:text-lab-turquoise"
        >
          ×
        </button>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  </div>
);
