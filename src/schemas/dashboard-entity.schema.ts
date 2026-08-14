import * as v from "valibot";

const nameSchema = v.pipe(
  v.string(),
  v.trim(),
  v.nonEmpty("Name cannot be empty"),
  v.maxLength(100, "Name cannot exceed 100 characters"),
);

const imageFileSchema = v.optional(
  v.pipe(
    v.file(),
    v.mimeType(
      ["image/jpeg", "image/png"],
      "Only JPEG and PNG images are allowed",
    ),
  ),
);

const translationSchema = v.object({
  language_code: v.string(),
  text_value: v.pipe(v.string(), v.trim()),
});

const optionalColorSchema = v.union([
  v.literal(""),
  v.pipe(
    v.string(),
    v.regex(/^#[0-9a-f]{6}$/i, "Color must be a six-digit hex value"),
  ),
]);

export const OrganisationEditSchema = v.object({
  name: nameSchema,
  lightPrimaryColor: optionalColorSchema,
  lightSecondaryColor: optionalColorSchema,
  darkPrimaryColor: optionalColorSchema,
  darkSecondaryColor: optionalColorSchema,
  lightLogoFile: imageFileSchema,
  existingLightLogoKey: v.optional(v.string()),
  removeLightLogo: v.optional(v.boolean()),
  darkLogoFile: imageFileSchema,
  existingDarkLogoKey: v.optional(v.string()),
  removeDarkLogo: v.optional(v.boolean()),
});

export const SiteEditSchema = v.object({
  name: nameSchema,
  address: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty("Address cannot be empty"),
    v.maxLength(100, "Address cannot exceed 100 characters"),
  ),
  nameTranslations: v.array(translationSchema),
  descriptionTranslations: v.array(translationSchema),
  welcomeTranslations: v.array(translationSchema),
  imageFile: imageFileSchema,
  existingImageKey: v.optional(v.string()),
  removeImage: v.optional(v.boolean()),
});

export const BuildingEditSchema = v.object({
  name: nameSchema,
  totalFloors: v.pipe(
    v.number("Number of floors is required"),
    v.integer("Number of floors must be a whole number"),
    v.minValue(1, "A building must have at least one floor"),
  ),
  allowedOrganisations: v.array(v.number()),
  nameTranslations: v.array(translationSchema),
  descriptionTranslations: v.array(translationSchema),
  imageFile: imageFileSchema,
  existingImageKey: v.optional(v.string()),
  removeImage: v.optional(v.boolean()),
});

export type OrganisationEditInput = v.InferOutput<
  typeof OrganisationEditSchema
>;
export type SiteEditInput = v.InferOutput<typeof SiteEditSchema>;
export type BuildingEditInput = v.InferOutput<typeof BuildingEditSchema>;
