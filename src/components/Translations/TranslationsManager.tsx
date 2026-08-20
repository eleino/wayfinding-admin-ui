import type { AppInitLanguage } from "@apptypes/init";
import type { AppTranslations } from "@apptypes/translation";
import { DeleteDialog } from "@components/Forms/DeleteDialog";
import { useDeleteTranslationKey } from "@hooks/useTranslations";
import { useMemo, useState } from "react";
import { CreateTranslationForm } from "./TranslationForm/CreateTranslationForm";
import { TranslationCard } from "./TranslationCard";
import { TranslationEditor } from "./TranslationForm/TranslationEditor";
import { TranslationModal } from "./TranslationModal";
import {
  TranslationSearch,
  type TranslationFilter,
} from "./TranslationSearch";

type GroupedTranslations = Record<string, Record<string, string>>;
type OpenForm =
  | { type: "create", key: undefined }
  | { type: "edit"; key: string }
  | { type: "delete"; key: string }
  | null;

export const TranslationsManager = ({
  languages,
  translationsByLanguage,
}: {
  languages: AppInitLanguage[];
  translationsByLanguage: AppTranslations[];
}) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<TranslationFilter>("all");
  const [openForm, setOpenForm] = useState<OpenForm>(null);
  const deleteTranslationKey = useDeleteTranslationKey();

  // group translations by key and language for easier rendering
  const groupedTranslations = useMemo<GroupedTranslations>(() => {
    const grouped: GroupedTranslations = {};
    for (const langTranslations of translationsByLanguage) {
      for (const [lang, translations] of Object.entries(langTranslations)) {
        for (const translation of translations ?? []) {
          grouped[translation.translation_key] ??= {};
          grouped[translation.translation_key][lang] = translation.text_value;
        }
      }
    }
    return grouped;
  }, [translationsByLanguage]);

  // filter and sort translations based on search and filter state
  const filteredTranslations = useMemo(() => {
    const needle = search.trim().toLocaleLowerCase();
    return Object.entries(groupedTranslations)
      .filter(
        ([key, translations]) =>
          (filter === "all" ||
            languages.some(
              (language) => !translations[language.code]?.trim(), // missing translation for a language
            )) &&
          (!needle ||
            key.toLocaleLowerCase().includes(needle) || // key matches search
            Object.values(translations).some((text) =>
              text.toLocaleLowerCase().includes(needle), // a translation text matches search
            )),
      )
      .sort(([left], [right]) => left.localeCompare(right)); // sort alphabetically by translation key
  }, [filter, groupedTranslations, languages, search]);

  const selectedTranslations = openForm?.key ? groupedTranslations[openForm.key] : undefined;

  const handleDelete = async () => {
    if (openForm?.type !== "delete" || !selectedTranslations) return;
    try {
      await deleteTranslationKey.mutateAsync({
        translationKey: openForm.key,
        languageCodes: Object.keys(selectedTranslations),
      });
      setOpenForm(null);
    } catch {
      // The mutation error stays visible in the confirmation dialog.
    }
  };

  return (
    <section aria-label="App translations" className="w-full min-w-0 bg-sidebar-grey p-4 rounded">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <TranslationSearch
          search={search}
          filter={filter}
          onSearchChange={setSearch}
          onFilterChange={setFilter}
        />
        <button
          type="button"
          onClick={() => setOpenForm({ type: "create", key: undefined })}
          className="cursor-pointer rounded bg-lab-blue px-4 py-2 text-white"
        >
          Create app translation
        </button>
      </div>
      <p className="mb-3 text-sm text-gray-400" role="status">
        {filteredTranslations.length} translation key
        {filteredTranslations.length === 1 ? "" : "s"}
      </p>
      {filteredTranslations.length === 0 ? (
        <p className="rounded border border-border-grey bg-black/20 p-4 text-gray-400">
          {Object.keys(groupedTranslations).length === 0
            ? "No app translations are available yet."
            : filter === "missing" && !search.trim()
              ? "No translations are missing."
              : "No translations match your search and filter."}
        </p>
      ) : (
        <div className="space-y-3">
          {filteredTranslations.map(([key, translations]) => (
            <TranslationCard
              key={key}
              translationKey={key}
              translations={translations}
              languages={languages}
              onEdit={() => setOpenForm({ type: "edit", key })}
              onDelete={() => {
                deleteTranslationKey.reset();
                setOpenForm({ type: "delete", key });
              }}
            />
          ))}
        </div>
      )}

      {openForm?.type === "create" && (
        <TranslationModal
          title="Create app translation"
          onClose={() => setOpenForm(null)}
        >
          <CreateTranslationForm
            languages={languages}
            onCancel={() => setOpenForm(null)}
            onCreated={() => setOpenForm(null)}
          />
        </TranslationModal>
      )}
      {openForm?.type === "edit" && selectedTranslations && (
        <TranslationModal
          title={`Edit ${openForm.key}`}
          onClose={() => setOpenForm(null)}
        >
          <TranslationEditor
            translationKey={openForm.key}
            translations={selectedTranslations}
            languages={languages}
            onClose={() => setOpenForm(null)}
          />
        </TranslationModal>
      )}
      {openForm?.type === "delete" && selectedTranslations && (
        <DeleteDialog
          title={`Delete ${openForm.key}`}
          itemName={openForm.key}
          description={
            <p>
              Delete <strong className="break-all">{openForm.key}</strong> in
              all languages? This action cannot be undone.
            </p>
          }
          confirmLabel="Delete translation"
          pendingLabel="Deleting translation..."
          isPending={deleteTranslationKey.isPending}
          error={deleteTranslationKey.error}
          onCancel={() => setOpenForm(null)}
          onConfirm={handleDelete}
        />
      )}
    </section>
  );
};
