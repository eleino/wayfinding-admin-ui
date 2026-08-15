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
  loadingMessage,
  hasError,
  hasChanges,
  onClose,
}: {
  isSaving: boolean;
  loadingMessage?: string | null;
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
        {isSaving ? (loadingMessage ?? "Saving...") : "Save changes"}
      </button>
    </div>
  </>
);

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
