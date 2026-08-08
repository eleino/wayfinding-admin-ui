import type { ExistingImageGroup, SelectableImage } from "@apptypes/image";
import { useEffect, useId, useMemo, useState } from "react";

const GROUPS_PER_PAGE = 2;
const IMAGES_PER_PAGE = 20;

const limitGroups = (
  groups: ExistingImageGroup[],
  groupLimit: number,
  imageLimit: number,
) => {
  let remainingImages = imageLimit;
  const visibleGroups: ExistingImageGroup[] = [];

  // Iterate through the groups and limit the number of images displayed per group
  for (const group of groups.slice(0, groupLimit)) {
    if (remainingImages === 0) break;

    const images = group.images.slice(0, remainingImages);
    if (images.length > 0) visibleGroups.push({ ...group, images });
    remainingImages -= images.length;
  }
  return visibleGroups;
};

interface ExistingImagePickerProps {
  groups: ExistingImageGroup[];
  isLoading?: boolean;
  error?: Error | null;
  onSelect: (image: SelectableImage) => void;
  onClose: () => void;
}

export const ExistingImagePicker = ({
  groups,
  isLoading,
  error,
  onSelect,
  onClose,
}: ExistingImagePickerProps) => {
  const titleId = useId();
  const [search, setSearch] = useState("");
  const [visibleGroupLimit, setVisibleGroupLimit] = useState(GROUPS_PER_PAGE);
  const [visibleImageLimit, setVisibleImageLimit] = useState(IMAGES_PER_PAGE);

  const filteredGroups = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return groups;
    return groups
      .map((group) => ({ // filter group images based on search query
        ...group,
        images: group.images.filter((image) =>
          image.key.toLowerCase().includes(query),
        ),
      }))
      .filter((group) => group.images.length > 0);
  }, [groups, search]);

  // total number of images across all groups
  const totalImages = groups.reduce(
    (total, group) => total + group.images.length,
    0,
  );
  // filtered image count when user has entered a search query
  const filteredImageCount = filteredGroups.reduce(
    (total, group) => total + group.images.length,
    0,
  );
  const visibleGroups = useMemo(
    () =>
      limitGroups(filteredGroups, visibleGroupLimit, visibleImageLimit),
    [filteredGroups, visibleGroupLimit, visibleImageLimit],
  );
  // total number of images currently visible across all groups
  const visibleImageCount = visibleGroups.reduce(
    (total, group) => total + group.images.length,
    0,
  );
  const hasMoreImages =
    visibleImageCount < filteredImageCount ||
    visibleGroups.length < filteredGroups.length;

  // Close the modal when user presses Esc
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-[90vh] w-full max-w-5xl flex-col rounded-xl border border-border-grey bg-sidebar-grey p-5 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id={titleId} className="text-xl font-semibold">
              Choose an existing image
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              The selected image will be copied when you save.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close existing image picker"
            className="h-9 w-9 shrink-0 cursor-pointer rounded border border-border-grey text-xl hover:border-lab-turquoise hover:text-lab-turquoise"
          >
            {"\u00d7"}
          </button>
        </div>

        <label className="mt-4 text-sm" htmlFor={`${titleId}-search`}>
          Search by image key
        </label>
        <input
          id={`${titleId}-search`}
          type="search"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setVisibleGroupLimit(GROUPS_PER_PAGE);
            setVisibleImageLimit(IMAGES_PER_PAGE);
          }}
          placeholder="For example, IMAGE_NEXT_5"
          className="mt-1 rounded border border-border-grey bg-black px-3 py-2 focus:border-lab-turquoise focus:outline-none"
        />

        <div className="mt-4 min-h-0 overflow-y-auto pr-1">
          {isLoading && <p className="text-gray-400">Loading images...</p>}
          {error && (
            <p role="alert" className="text-red-400">
              Existing images could not be loaded.
            </p>
          )}
          {!isLoading && !error && totalImages === 0 && (
            <p className="text-gray-400">No existing images found.</p>
          )}
          {!isLoading && !error && totalImages > 0 && filteredGroups.length === 0 && (
            <p className="text-gray-400">No image keys match your search.</p>
          )}

          {visibleGroups.map((group) => {

            return (
              <section key={group.label} className="mb-6 last:mb-0">
                <h3 className="sticky top-0 z-10 mb-2 bg-sidebar-grey py-1 font-semibold text-lab-turquoise">
                  {group.label}
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {group.images.map((image) => (
                    <button
                      type="button"
                      key={`${image.type}:${image.key}`}
                      onClick={() => onSelect(image)}
                      className="group cursor-pointer overflow-hidden rounded-lg border border-border-grey bg-black text-left transition-colors hover:border-lab-turquoise focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lab-turquoise"
                    >
                      <img
                        src={image.url}
                        alt=""
                        loading="lazy"
                        className="h-28 w-full object-cover"
                      />
                      <span className="block break-all px-2 pt-2 text-xs text-gray-400">
                        {image.type}
                      </span>
                      <span className="block break-all px-2 pb-2 text-sm group-hover:text-lab-turquoise">
                        {image.key}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            );
          })}

          {!isLoading && !error && filteredImageCount > 0 && (
            <div className="sticky bottom-0 flex items-center justify-between gap-4 border-t border-border-grey bg-sidebar-grey p-3 w-full">
              {hasMoreImages ? (
                <button
                  type="button"
                  onClick={() => {
                    setVisibleGroupLimit(
                      (current) => current + GROUPS_PER_PAGE,
                    );
                    setVisibleImageLimit(
                      (current) => current + IMAGES_PER_PAGE,
                    );
                  }}
                  className="cursor-pointer rounded bg-lab-blue px-4 py-2 text-sm text-white hover:brightness-110"
                >
                  Load more images
                </button>
              ): (
                <span className="text-sm text-gray-400">
                  No more images to load
                </span>
              )}
              <span className="text-sm text-gray-400">
                Showing {visibleImageCount} of {filteredImageCount} images
              </span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
