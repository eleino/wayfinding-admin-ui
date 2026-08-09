import * as v from "valibot";

const translationValueSchema = v.object({
  language_code: v.string(),
  text_value: v.pipe(
  v.string(),
  v.trim(),
  v.nonEmpty("Translation text cannot be empty"),
),
});

export const CreateAppTranslationSchema = v.object({
  translation_key: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty("Translation key cannot be empty"),
  ),
  translations: v.array(translationValueSchema),
});

export const EditAppTranslationSchema = v.object({
  translations: v.array(translationValueSchema),
});

export type CreateAppTranslationInput = v.InferOutput<
  typeof CreateAppTranslationSchema
>;
export type EditAppTranslationInput = v.InferOutput<
  typeof EditAppTranslationSchema
>;
