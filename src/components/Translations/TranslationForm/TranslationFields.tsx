import { Field, FieldArray, useForm } from "@formisch/react";
import type { AppInitLanguage } from "@apptypes/init";
import { EditAppTranslationSchema } from "@schemas/translation.schema";
import { translationInputClassName } from "../translationUi";

export const TranslationFields = ({
  form,
  languages,
  missingLanguageCodes = new Set<string>(),
}: {
  form: ReturnType<typeof useForm<typeof EditAppTranslationSchema>>;
  languages: AppInitLanguage[];
  missingLanguageCodes?: Set<string>;
}) => (
  <FieldArray of={form} path={["translations"]}>
    {(fieldArray) => (
      <div className="grid gap-3 md:grid-cols-2">
        {fieldArray.items.map((item, index) => {
          const language = languages[index];
          const isMissing = language
            ? missingLanguageCodes.has(language.code)
            : false;
          return (
            <Field
              key={item}
              of={form}
              path={["translations", index, "text_value"]}
            >
              {(field) => (
                <label className="flex flex-col gap-1">
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    {language?.name ?? `Language ${index + 1}`}
                    {isMissing && (
                      <span className="rounded bg-red-500/15 px-2 py-0.5 text-xs font-normal text-red-300">
                        Missing
                      </span>
                    )}
                  </span>
                  <textarea
                    rows={3}
                    {...field.props}
                    value={field.input ?? ""}
                    required
                    className={`${translationInputClassName} ${
                      isMissing ? "border-red-500" : ""
                    }`}
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
          );
        })}
      </div>
    )}
  </FieldArray>
);
