import * as v from "valibot";

export const TranslationSchema = v.object({
  lang: v.string(),
  text: v.optional(v.string()),
});

type TranslationInput = v.InferOutput<typeof TranslationSchema>;

export const hasTranslation = v.check(
  (translations: TranslationInput[]) =>
    translations.some((item) => item.text && item.text.trim().length > 0),
  "At least one translation is required",
);

export const NameTranslationSchema = v.object({
  lang: v.string(),
  text: v.pipe(
    v.string(),
    v.nonEmpty("Location name translation cannot be empty"),
  ),
});


export const LocationSchema = v.object({
  location_name: v.pipe(v.string(), v.nonEmpty("Name cannot be empty")),
  is_entry_location: v.boolean(),
  floor_number: v.pipe(
    v.number("Floor number is required and must be a number between 1 and 3"),
    v.integer(),
    v.toMinValue(1),
    v.toMaxValue(3),
  ),
  trl_location_name: v.array(NameTranslationSchema),
  trl_at_current_location_msg: v.pipe(
    v.array(TranslationSchema),
    hasTranslation,
  ),
  imageFile: v.optional(
    v.pipe(
      v.file(),
      v.mimeType(
        ["image/jpeg", "image/png"],
        "Only JPEG and PNG images are allowed",
      ),
    ),
  ),
  existingImageKey: v.optional(v.string()),
  removeImage: v.optional(v.boolean()),
});

export type LocationInput = v.InferOutput<typeof LocationSchema>;
export type EditLocationInput = LocationInput & {
  imageUrl?: string | null;
};