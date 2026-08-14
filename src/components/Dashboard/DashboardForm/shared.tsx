import { useId, useState } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";
import type { ExistingImageGroup } from "@apptypes/image";
import { ImageDropBox } from "@components/Forms/ImageDropBox";

export const inputClassName =
  "mt-1 w-full rounded border border-border-grey bg-black px-3 py-2 outline-none focus:border-lab-turquoise";

export const FormError = ({ message }: { message?: string }) =>
  message ? (
    <span className="mt-1 block text-sm text-red-300" role="alert">
      {message}
    </span>
  ) : null;

export const SaveActions = ({
  isSaving,
  hasError,
  hasChanges,
  onClose,
}: {
  isSaving: boolean;
  hasError: boolean;
  hasChanges: boolean;
  onClose: () => void;
}) => (
  <>
    {hasError && (
      <p className="text-sm text-red-300" role="alert">
        Changes could not be saved. Please try again.
      </p>
    )}
    <div className="flex justify-end gap-2 pt-3">
      <button
        type="button"
        onClick={onClose}
        disabled={isSaving}
        className="cursor-pointer rounded border border-border-grey px-4 py-2 hover:border-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSaving || !hasChanges}
        title={!hasChanges ? "No changes to save" : undefined}
        className="cursor-pointer rounded bg-lab-blue px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSaving ? "Saving…" : "Save changes"}
      </button>
    </div>
  </>
);

export const ThemeColorPicker = ({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) => {
  const pickerId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const hasCustomColor = !!value;

  return (
    <div className="rounded border border-border-grey bg-black/30 p-3">
      <p className="block text-sm font-medium">
        {label}
      </p>
      <div className="mt-2 flex min-h-10 items-center gap-3">
        {hasCustomColor ? (
          <>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={pickerId}
              onClick={() => setIsOpen((open) => !open)}
              className="flex cursor-pointer items-center gap-3 rounded border border-border-grey px-2 py-1.5 hover:border-lab-turquoise"
            >
              <span
                aria-hidden="true"
                className="h-7 w-10 rounded border border-white/40"
                style={{ backgroundColor: value }}
              />
              <span className="font-mono text-sm text-gray-300">{value}</span>
              <span className="text-xs text-lab-turquoise">
                {isOpen ? "Close picker" : "Edit color"}
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onChange("");
              }}
              className="ml-auto cursor-pointer rounded border border-border-grey px-2 py-1 text-xs hover:border-red-400 hover:text-red-300"
            >
              Use default
            </button>
          </>
        ) : (
          <button
            type="button"
            aria-controls={pickerId}
            onClick={() => {
              onChange("#000000");
              setIsOpen(true);
            }}
            className="cursor-pointer rounded border border-lab-turquoise px-3 py-1.5 text-sm text-lab-turquoise hover:bg-lab-turquoise/10"
          >
            Set custom color
          </button>
        )}
      </div>
      {hasCustomColor && isOpen && (
        <div
          id={pickerId}
          role="group"
          aria-label={`${label} picker`}
          className="mt-3 max-w-64 rounded border border-border-grey bg-black p-3"
        >
          <HexColorPicker
            color={value}
            onChange={onChange}
            style={{ width: "100%", height: "180px" }}
          />
          <label
            htmlFor={`${pickerId}-hex`}
            className="mt-3 block text-xs font-medium text-gray-300"
          >
            Hex value
            <HexColorInput
              id={`${pickerId}-hex`}
              color={value}
              onChange={onChange}
              prefixed
              aria-label={`${label} hex value`}
              className={inputClassName}
            />
          </label>
        </div>
      )}
      <FormError message={error} />
    </div>
  );
};

export const TranslationInput = ({
  languageName,
  value,
  onChange,
  name,
  multiline = false,
  error,
}: {
  languageName: string;
  value: string;
  onChange: (value: string) => void;
  name: string;
  multiline?: boolean;
  error?: string;
}) => (
  <label className="block text-sm font-medium">
    {languageName}
    {multiline ? (
      <textarea
        name={name}
        rows={3}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClassName}
      />
    ) : (
      <input
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClassName}
      />
    )}
    <FormError message={error} />
  </label>
);

export const ImageEditor = ({
  label,
  imageUrl,
  groups,
  isLoading,
  error,
  onFileSelect,
  onExistingImageSelect,
  onRemove,
  validationError,
}: {
  label: string;
  imageUrl?: string;
  groups: ExistingImageGroup[];
  isLoading: boolean;
  error: Error | null;
  onFileSelect: (file: File | undefined) => void;
  onExistingImageSelect: (key: string | undefined) => void;
  onRemove: () => void;
  validationError?: string;
}) => (
  <div className="space-y-1">
    <p className="text-sm font-medium">{label} (optional, JPEG or PNG)</p>
    <ImageDropBox
      imageUrl={imageUrl}
      existingImageGroups={groups}
      existingImagesLoading={isLoading}
      existingImagesError={error}
      onFileSelect={onFileSelect}
      onExistingImageSelect={(image) => onExistingImageSelect(image?.key)}
      onExistingImageRemove={onRemove}
    />
    <FormError message={validationError} />
  </div>
);
