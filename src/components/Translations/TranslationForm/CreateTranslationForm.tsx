import { Field, Form, useForm } from "@formisch/react";
import type { AppInitLanguage } from "@apptypes/init";
import { useCreateTranslationKey } from "@hooks/useTranslations";
import {
  CreateAppTranslationSchema,
  type CreateAppTranslationInput,
} from "@schemas/translation.schema";
import { useState } from "react";
import { TranslationFields } from "./TranslationFields";
import {
  getTranslationErrorMessage,
  translationInputClassName,
} from "../translationUi";

export const CreateTranslationForm = ({
  languages,
  onCancel,
  onCreated,
}: {
  languages: AppInitLanguage[];
  onCancel: () => void;
  onCreated: () => void;
}) => {
  const createTranslationKey = useCreateTranslationKey();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const initialInput: CreateAppTranslationInput = {
    translation_key: "",
    translations: languages.map((language) => ({
      language_code: language.code,
      text_value: "",
    })),
  };
  const form = useForm({
    schema: CreateAppTranslationSchema,
    initialInput,
    validate: "blur",
  });

  const handleCreate = async (values: CreateAppTranslationInput) => {
    setErrorMessage(null);
    createTranslationKey.reset();

    try {
      await createTranslationKey.mutateAsync({
        translationKey: values.translation_key,
        type: "app",
        translations: values.translations,
      });
      onCreated();
    } catch (error) {
      setErrorMessage(
        getTranslationErrorMessage(
          error,
          "The translation could not be created.",
        ),
      );
    }
  };

  return (
    <Form of={form} onSubmit={handleCreate} className="space-y-4">
      <Field of={form} path={["translation_key"]}>
        {(field) => (
          <label className="flex max-w-xl flex-col gap-1">
            <span className="text-sm font-semibold">Translation key</span>
            <input
              {...field.props}
              value={field.input ?? ""}
              required
              className={translationInputClassName}
              placeholder="For example: APP_WELCOME_MESSAGE"
              onChange={(event) => field.onChange(event.target.value)}
            />
            {field.errors && (
              <span className="text-sm text-red-300" role="alert">
                {field.errors[0]}
              </span>
            )}
          </label>
        )}
      </Field>
      <TranslationFields form={form} languages={languages} />
      {errorMessage && (
        <p className="text-red-300" role="alert">
          {errorMessage}
        </p>
      )}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          disabled={createTranslationKey.isPending}
          onClick={onCancel}
          className="cursor-pointer rounded border border-border-grey px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={createTranslationKey.isPending}
          className="cursor-pointer rounded bg-lab-green-dark px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {createTranslationKey.isPending ? "Creating…" : "Create translation"}
        </button>
      </div>
    </Form>
  );
};
