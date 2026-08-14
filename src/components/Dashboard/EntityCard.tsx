interface EntityCardProps {
  title: string;
  subtitle?: string;
  imageUrl?: string | null;
  imageAlt?: string;
  isSelected: boolean;
  onSelect: () => void;
  onView: () => void;
  onEdit: () => void;
  meta?: string;
}

/**
 * A card component that displays a title, subtitle, image, and action buttons.
 * Used for displaying orgs, sites, and buildings on the dashboard.
 * @param {EntityCardProps} props - The props for the EntityCard component.
 * @param {string} props.title - The title of the card.
 * @param {string} [props.subtitle] - The subtitle of the card.
 * @param {string | null} [props.imageUrl] - The URL of the image to display on the card.
 * @param {string} [props.imageAlt] - The alt text for the image.
 * @param {boolean} props.isSelected - Whether the card is selected or not.
 * @param {() => void} props.onSelect - Callback function when the card is selected.
 * @param {() => void} props.onView - Callback function when the "View details" button is clicked.
 * @param {() => void} props.onEdit - Callback function when the "Edit" button is clicked.
 * @param {string} [props.meta] - Additional metadata to display on the card.
 * @returns {JSX.Element} The rendered EntityCard component.
 */
export const EntityCard = ({
  title,
  subtitle,
  imageUrl,
  imageAlt,
  isSelected,
  onSelect,
  onView,
  onEdit,
  meta,
}: EntityCardProps) => (
  <article
    className={`group relative flex min-h-44 cursor-pointer flex-col rounded-xl border p-4 transition-colors ${
      isSelected
        ? "border-lab-turquoise bg-lab-turquoise/5"
        : "border-border-grey bg-sidebar-grey hover:border-gray-500"
    }`}
    onClick={onSelect}
    aria-current={isSelected ? "true" : undefined}
  >
    <div className="flex min-w-0 items-start gap-3">
      {imageUrl ? (
        <div className="flex w-22 h-22 items-center justify-center rounded-lg">
        <img
          src={imageUrl}
          alt={imageAlt ?? ""}
          className="h-full w-full rounded-lg bg-black object-contain p-1"
        /></div>
      ) : (
        <div
          className="flex h-22 w-22 shrink-0 items-center justify-center rounded-lg bg-black text-xl font-semibold text-gray-500"
          aria-hidden="true"
        >
          {title.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2 min-h-6">
          <h3 className="truncate text-lg font-semibold">{title}</h3>
          {isSelected && (
            <span className="rounded-full bg-lab-turquoise/15 px-2 py-1 text-xs font-semibold text-lab-turquoise">
              Selected
            </span>
          )}
        </div>
        {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
        {meta && <div className="mt-2 text-xs text-gray-500">{meta}</div>}
      </div>
    </div>
    <div className="mt-auto flex gap-2 pt-4">
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onView();
        }}
        className="cursor-pointer rounded border border-border-grey px-3 py-2 text-sm hover:border-lab-turquoise hover:text-lab-turquoise"
      >
        View details
      </button>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onEdit();
        }}
        className="cursor-pointer rounded bg-lab-blue px-3 py-2 text-sm text-white hover:bg-lab-blue/80"
      >
        Edit
      </button>
    </div>
  </article>
);
