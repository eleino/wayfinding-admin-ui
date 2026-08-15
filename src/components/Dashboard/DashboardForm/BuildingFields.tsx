import {
  useField,
  useFieldArray,
  type FormStore,
} from "@formisch/react";
import { TextInput } from "@components/Forms/TextInput";
import { BuildingEditSchema } from "@schemas/dashboard-entity.schema";
import type {
  BuildingFormData,
  ImageFormData,
  TranslationFormData,
} from "./types";
import {
  FormError,
  ImageEditor,
  inputClassName,
  TranslationInput,
} from "./shared";

type TranslationPath = "nameTranslations" | "descriptionTranslations";

const BuildingTranslationValue = ({
  form,
  path,
  index,
  language,
  multiline,
}: {
  form: FormStore<typeof BuildingEditSchema>;
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

const BuildingTranslationFields = ({
  form,
  path,
  title,
  languages,
  multiline,
}: {
  form: FormStore<typeof BuildingEditSchema>;
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
          <BuildingTranslationValue
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

interface BuildingFieldsProps {
  form: FormStore<typeof BuildingEditSchema>;
  imageKey: string;
  images: ImageFormData;
  languages: TranslationFormData["languages"];
  organisations: BuildingFormData["organisations"];
}

export const BuildingFields = ({
  form,
  imageKey,
  images,
  languages,
  organisations,
}: BuildingFieldsProps) => {
  const nameField = useField(form, { path: ["name"] });
  const floorField = useField(form, { path: ["totalFloors"] });
  const organisationsField = useField(form, {
    path: ["allowedOrganisations"],
  });
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
      <label className="block text-sm font-medium">
        Number of floors
        <input
          {...floorField.props}
          type="number"
          min={1}
          value={floorField.input}
          onChange={(event) => floorField.onChange(Number(event.target.value))}
          className={inputClassName}
        />
        <FormError message={floorField.errors?.[0]} />
      </label>
      <fieldset>
        <legend className="text-sm font-medium">Organisation access</legend>
        <div className="mt-2 grid grid-cols-2 gap-2 rounded border border-border-grey p-3">
          {organisations.map((organisation) => {
            const id = Number(organisation.id);
            const checked = organisationsField.input.includes(id);
            return (
              <label
                key={organisation.id}
                className="flex cursor-pointer items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    organisationsField.onChange(
                      checked
                        ? organisationsField.input.filter((item) => item !== id)
                        : [...organisationsField.input, id],
                    )
                  }
                  className="accent-lab-turquoise"
                />
                {organisation.name}
              </label>
            );
          })}
        </div>
        <FormError message={organisationsField.errors?.[0]} />
      </fieldset>
      <BuildingTranslationFields
        form={form}
        path="nameTranslations"
        title="Translated name"
        languages={languages}
      />
      <BuildingTranslationFields
        form={form}
        path="descriptionTranslations"
        title="Description"
        languages={languages}
        multiline
      />
      <ImageEditor
        label="Building image"
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
