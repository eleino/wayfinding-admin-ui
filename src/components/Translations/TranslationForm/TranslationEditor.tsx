import { Form, useForm } from "@formisch/react";
import type { AppInitLanguage } from "@apptypes/init";
import { useSaveTranslationKey } from "@hooks/useTranslations";
import {
  EditAppTranslationSchema,
  type EditAppTranslationInput,
} from "@schemas/translation.schema";
import { useState } from "react";
import { TranslationFields } from "./TranslationFields";
import { getTranslationErrorMessage } from "../translationUi";

export const TranslationEditor = ({
  translationKey,
  translations,
  languages,
  onClose,
}: {
  translationKey: string;
  translations: Record<string, string>;
  languages: AppInitLanguage[];
  onClose: () => void;
}) => {
  const saveTranslationKey = useSaveTranslationKey();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const initialInput: EditAppTranslationInput = {
    translations: languages.map((language) => ({
      language_code: language.code,
      text_value: translations[language.code] ?? "",
    })),
  };
  const form = useForm({
    schema: EditAppTranslationSchema,
    initialInput,
    validate: "blur",
  });
  const missingLanguageCodes = new Set(
    languages
      .filter((language) => !translations[language.code]?.trim())
      .map((language) => language.code),
  );

  const handleSave = async (values: EditAppTranslationInput) => {
    setErrorMessage(null);
    saveTranslationKey.reset();

    try {
      await saveTranslationKey.mutateAsync({
        translationKey,
        type: "app",
        existingTranslations: translations,
        translations: values.translations,
      });
      onClose();
    } catch (error) {
      setErrorMessage(
        getTranslationErrorMessage(
          error,
          "The translation could not be saved.",
        ),
      );
    }
  };

  return (
    <div>
      <Form of={form} onSubmit={handleSave} className="space-y-4">
        <TranslationFields
          form={form}
          languages={languages}
          missingLanguageCodes={missingLanguageCodes}
        />
        {errorMessage && (
          <p className="text-red-300" role="alert">
            {errorMessage}
          </p>
        )}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            disabled={saveTranslationKey.isPending}
            onClick={onClose}
            className="cursor-pointer rounded border border-border-grey px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saveTranslationKey.isPending}
            className="cursor-pointer rounded bg-lab-green-dark px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saveTranslationKey.isPending ? "Saving…" : "Save changes"}
          </button>
        </div>
      </Form>
    </div>
  );
};
