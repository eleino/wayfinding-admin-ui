import type { AppInitLanguage } from "@apptypes/init";

export const TranslationCard = ({
  translationKey,
  translations,
  languages,
  onEdit,
  onDelete,
}: {
  translationKey: string;
  translations: Record<string, string>;
  languages: AppInitLanguage[];
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const missingCount = languages.filter(
    (language) => !translations[language.code]?.trim(),
  ).length;

  return (
    <article
      aria-label={`Translation ${translationKey}`}
      className={`rounded border bg-black/20 p-4 ${
        missingCount > 0 ? "border-red-500/60" : "border-border-grey"
      }`}
    >
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="break-all text-lg font-semibold text-lab-turquoise">
          {translationKey}
        </h2>
        {missingCount > 0 && (
          <span className="whitespace-nowrap rounded bg-red-500/15 px-2 py-1 text-xs text-red-300">
            Translations missing: {missingCount}
          </span>
        )}
        <div className="ml-auto flex gap-2">
          <button
            type="button"
            aria-label={`Edit ${translationKey}`}
            onClick={onEdit}
            className="cursor-pointer rounded border border-border-grey bg-lab-blue px-3 py-1.5 text-sm hover:border-lab-turquoise hover:text-lab-turquoise"
          >
            Edit Translation
          </button>
          <button
            type="button"
            aria-label={`Delete ${translationKey}`}
            onClick={onDelete}
            className="cursor-pointer rounded border border-red-500/60 px-3 py-1.5 text-sm text-red-300 hover:bg-red-500/10"
          >
            Delete
          </button>
        </div>
      </div>
      <dl className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {languages.map((language) => {
          const text = translations[language.code]?.trim();
          return (
            <div
              key={language.code}
              className={`min-w-0 rounded border bg-black p-3 ${
                text
                  ? "border-border-grey"
                  : "border-red-500/50 bg-red-500/5"
              }`}
            >
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                {language.name}
              </dt>
              <dd
                className={`mt-1 break-words ${text ? "" : "text-red-300"}`}
              >
                {text || "Missing translation"}
              </dd>
            </div>
          );
        })}
      </dl>
    </article>
  );
};
