import {
  useField,
  useFieldArray,
  type FormStore,
} from "@formisch/react";
import { TextInput } from "@components/Forms/TextInput";
import { SiteEditSchema } from "@schemas/dashboard-entity.schema";
import type { ImageFormData, TranslationFormData } from "./types";
import { ImageEditor, inputClassName, TranslationInput } from "./shared";

type TranslationPath =
  | "nameTranslations"
  | "descriptionTranslations"
  | "welcomeTranslations";

const SiteTranslationValue = ({
  form,
  path,
  index,
  language,
  multiline,
}: {
  form: FormStore<typeof SiteEditSchema>;
  path: TranslationPath;
  index: number;
  language: { code: string; name: string } | undefined;
  multiline?: boolean;
}) => {
  const field = useField(form, { path: [path, index, "text_value"] });
  return (
    <TranslationInput
      languageName={language?.name ?? `Language ${index + 1}`}
      name={`${path}_${language?.code ?? index}`}
      value={field.input ?? ""}
      onChange={field.onChange}
      multiline={multiline}
      error={field.errors?.[0]}
    />
  );
};

const SiteTranslationFields = ({
  form,
  path,
  title,
  languages,
  multiline,
}: {
  form: FormStore<typeof SiteEditSchema>;
  path: TranslationPath;
  title: string;
  languages: TranslationFormData["languages"];
  multiline?: boolean;
}) => {
  const fieldArray = useFieldArray(form, { path: [path] });
  return (
    <fieldset className="space-y-3 rounded border border-border-grey p-3">
      <legend className="px-1 text-sm font-semibold">{title}</legend>
      <div className="grid gap-3 md:grid-cols-2">
        {fieldArray.items.map((item, index) => (
          <SiteTranslationValue
            key={item}
            form={form}
            path={path}
            index={index}
            language={languages[index]}
            multiline={multiline}
          />
        ))}
      </div>
    </fieldset>
  );
};

interface SiteFieldsProps {
  form: FormStore<typeof SiteEditSchema>;
  imageKey: string;
  images: ImageFormData;
  languages: TranslationFormData["languages"];
}

export const SiteFields = ({
  form,
  imageKey,
  images,
  languages,
}: SiteFieldsProps) => {
  const nameField = useField(form, { path: ["name"] });
  const addressField = useField(form, { path: ["address"] });
  const imageFileField = useField(form, { path: ["imageFile"] });
  const existingImageField = useField(form, { path: ["existingImageKey"] });
  const removeImageField = useField(form, { path: ["removeImage"] });

  return (
    <>
      <TextInput
        label="Internal name"
        {...nameField.props}
        input={nameField.input}
        errors={nameField.errors}
        onChange={(event) => nameField.onChange(event.target.value)}
        containerClassName="w-full text-sm"
        inputClassName={inputClassName}
      />
      <TextInput
        label="Address"
        {...addressField.props}
        input={addressField.input}
        errors={addressField.errors}
        onChange={(event) => addressField.onChange(event.target.value)}
        containerClassName="w-full text-sm"
        inputClassName={inputClassName}
      />
      <SiteTranslationFields
        form={form}
        path="nameTranslations"
        title="Translated name"
        languages={languages}
      />
      <SiteTranslationFields
        form={form}
        path="descriptionTranslations"
        title="Description"
        languages={languages}
        multiline
      />
      <SiteTranslationFields
        form={form}
        path="welcomeTranslations"
        title="Welcome message"
        languages={languages}
        multiline
      />
      <ImageEditor
        label="Site image"
        imageUrl={images.urlFor(imageKey)}
        groups={images.groups}
        isLoading={images.isLoading}
        error={images.error}
        validationError={imageFileField.errors?.[0]}
        onFileSelect={(file) => {
          imageFileField.onChange(file);
          if (file) {
            existingImageField.onChange(undefined);
            removeImageField.onChange(false);
          }
        }}
        onExistingImageSelect={(key) => {
          existingImageField.onChange(key);
          if (key) {
            imageFileField.onChange(undefined);
            removeImageField.onChange(false);
          }
        }}
        onRemove={() => removeImageField.onChange(true)}
      />
    </>
  );
};
