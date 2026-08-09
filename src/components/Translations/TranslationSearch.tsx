import { translationInputClassName } from "./translationUi";

export type TranslationFilter = "all" | "missing";

export const TranslationSearch = ({
  search,
  filter,
  onSearchChange,
  onFilterChange,
}: {
  search: string;
  filter: TranslationFilter;
  onSearchChange: (search: string) => void;
  onFilterChange: (filter: TranslationFilter) => void;
}) => (
  <div className="flex w-full max-w-3xl flex-col gap-3 sm:w-auto sm:flex-1 sm:flex-row sm:items-end">
    <label className="flex flex-1 flex-col gap-1">
      <span className="text-sm font-semibold">Search translations</span>
      <input
        type="search"
        value={search}
        className={translationInputClassName}
        placeholder="Search by key or translated text"
        onChange={(event) => onSearchChange(event.target.value)}
        onFocus={(event) => event.target.select()}
      />
    </label>
    <label className="flex flex-col gap-1">
      <span className="text-sm font-semibold">Show</span>
      <select
        value={filter}
        className={`${translationInputClassName} sm:w-55`}
        onChange={(event) =>
          onFilterChange(event.target.value as TranslationFilter)
        }
      >
        <option value="all">All translations</option>
        <option value="missing">Missing translations</option>
      </select>
    </label>
  </div>
);
