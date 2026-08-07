import { useEffect, useId, useRef, useState } from "react";

interface ImageDropBoxProps {
  onFileSelect: (file: File | undefined) => void;
  onExistingImageRemove?: () => void;
  imageUrl?: string;
}

const REMOVE_COOLDOWN_MS = 1000;

export const ImageDropBox = ({
  onFileSelect,
  onExistingImageRemove,
  imageUrl,
}: ImageDropBoxProps) => {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const removeCooldownRef = useRef<number | undefined>(undefined);
  const [preview, setPreview] = useState<string | undefined>(imageUrl);
  const [hasSelectedFile, setHasSelectedFile] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isRemoveDisabled, setIsRemoveDisabled] = useState(false);

  // allow closing the preview modal with the Escape key
  useEffect(() => {
    if (!isPreviewOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsPreviewOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isPreviewOpen]);

  // clear cooldown timer when the component unmounts
  useEffect(
    () => () => {
      if (removeCooldownRef.current !== undefined) {
        window.clearTimeout(removeCooldownRef.current);
      }
    },
    [],
  );

  const clearRemoveCooldown = () => {
    if (removeCooldownRef.current !== undefined) {
      window.clearTimeout(removeCooldownRef.current);
      removeCooldownRef.current = undefined;
    }
    setIsRemoveDisabled(false);
  };

  const handleFile = (file: File) => {
    clearRemoveCooldown();
    onFileSelect(file);
    setHasSelectedFile(true);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    setIsPreviewOpen(false);
    onFileSelect(undefined);

    if (inputRef.current) inputRef.current.value = "";

    if (hasSelectedFile && imageUrl) {
      setPreview(imageUrl);
      setHasSelectedFile(false);
      setIsRemoveDisabled(true); // timeout to prevent accidental double clicks
      removeCooldownRef.current = window.setTimeout(() => {
        setIsRemoveDisabled(false);
        removeCooldownRef.current = undefined;
      }, REMOVE_COOLDOWN_MS);
      return;
    }

    setPreview(undefined);
    setHasSelectedFile(false);
    if (!hasSelectedFile) onExistingImageRemove?.(); // removed existing image
  };

  return (
    <>
      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        className="w-full max-w-md rounded-lg border border-dashed border-lab-turquoise bg-black p-3"
      >
        <div className="flex min-h-16 items-center gap-3">
          {preview && (
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              aria-label="Open larger image preview"
              className="shrink-0 cursor-zoom-in rounded border border-border-grey p-1 transition-colors hover:border-lab-turquoise focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lab-turquoise"
            >
              <img
                src={preview}
                alt="Selected image preview"
                className="h-14 w-14 rounded object-cover"
              />
            </button>
          )}

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="min-w-0 flex-1 cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lab-turquoise"
          >
            <span className="block text-sm font-medium text-lab-turquoise">
              {preview ? "Choose a different image" : "Choose an image"}
            </span>
            <span className="mt-1 block text-xs text-gray-400">
              or drag and drop a JPEG or PNG here
            </span>
          </button>

          {preview && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={isRemoveDisabled}
              className="shrink-0 cursor-pointer rounded border border-border-grey px-3 py-1.5 text-sm text-lab-gray-light transition-colors hover:border-red-400 hover:text-red-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lab-turquoise disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border-grey disabled:hover:text-lab-gray-light"
            >
              Remove
            </button>
          )}
        </div>

        <input
          id={inputId}
          type="file"
          ref={inputRef}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) handleFile(file);
          }}
          accept="image/jpeg,image/png"
          className="sr-only"
          aria-label="Upload image"
        />
      </div>

      {preview && isPreviewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsPreviewOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${inputId}-preview-title`}
            className="max-h-[90vh] w-full max-w-4xl rounded-xl border border-border-grey bg-sidebar-grey p-4 shadow-2xl"
          >
            <div className="mb-3 flex items-center justify-between gap-4">
              <h2 id={`${inputId}-preview-title`} className="text-lg font-semibold">
                Image preview
              </h2>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                aria-label="Close image preview"
                className="h-9 w-9 cursor-pointer rounded border border-border-grey text-xl hover:border-lab-turquoise hover:text-lab-turquoise"
              >
                {"\u00d7"}
              </button>
            </div>
            <img
              src={preview}
              alt="Large image preview"
              className="max-h-[calc(90vh-6rem)] w-full object-contain"
            />
          </section>
        </div>
      )}
    </>
  );
};
