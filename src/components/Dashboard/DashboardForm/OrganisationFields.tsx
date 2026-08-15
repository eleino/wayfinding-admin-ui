import { useField, type FormStore } from "@formisch/react";
import { OrganisationEditSchema } from "@schemas/dashboard-entity.schema";
import { TextInput } from "@components/Forms/TextInput";
import type { ImageFormData } from "./types";
import {
  ImageEditor,
  inputClassName,
} from "./shared";
import { ThemeColorPicker } from "./ThemeColorPicker";

interface OrganisationFieldsProps {
  form: FormStore<typeof OrganisationEditSchema>;
  lightLogoKey: string;
  darkLogoKey: string;
  images: ImageFormData;
}

export const OrganisationFields = ({
  form,
  lightLogoKey,
  darkLogoKey,
  images,
}: OrganisationFieldsProps) => {
  const nameField = useField(form, { path: ["name"] });
  const lightPrimaryField = useField(form, {
    path: ["lightPrimaryColor"],
  });
  const lightSecondaryField = useField(form, {
    path: ["lightSecondaryColor"],
  });
  const darkPrimaryField = useField(form, { path: ["darkPrimaryColor"] });
  const darkSecondaryField = useField(form, {
    path: ["darkSecondaryColor"],
  });
  const lightLogoFileField = useField(form, { path: ["lightLogoFile"] });
  const existingLightLogoField = useField(form, {
    path: ["existingLightLogoKey"],
  });
  const removeLightLogoField = useField(form, {
    path: ["removeLightLogo"],
  });
  const darkLogoFileField = useField(form, { path: ["darkLogoFile"] });
  const existingDarkLogoField = useField(form, {
    path: ["existingDarkLogoKey"],
  });
  const removeDarkLogoField = useField(form, { path: ["removeDarkLogo"] });

  return (
    <>
      <TextInput
        label="Name"
        {...nameField.props}
        input={nameField.input}
        errors={nameField.errors}
        onChange={(event) => nameField.onChange(event.target.value)}
        containerClassName="w-full text-sm"
        inputClassName={inputClassName}
      />

      <fieldset className="rounded border border-border-grey p-3">
        <legend className="px-1 text-sm font-semibold">Theme colors</legend>
        <p className="mb-3 text-xs text-gray-400">
          Colors without an override use the public app's default theme.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <section aria-labelledby="light-theme-colors" className="space-y-3">
            <h3 id="light-theme-colors" className="font-medium">
              Light theme
            </h3>
            <ThemeColorPicker
              label="Light primary color"
              value={lightPrimaryField.input ?? ""}
              onChange={lightPrimaryField.onChange}
              error={lightPrimaryField.errors?.[0]}
            />
            <ThemeColorPicker
              label="Light secondary color"
              value={lightSecondaryField.input ?? ""}
              onChange={lightSecondaryField.onChange}
              error={lightSecondaryField.errors?.[0]}
            />
          </section>
          <section aria-labelledby="dark-theme-colors" className="space-y-3">
            <h3 id="dark-theme-colors" className="font-medium">
              Dark theme
            </h3>
            <ThemeColorPicker
              label="Dark primary color"
              value={darkPrimaryField.input ?? ""}
              onChange={darkPrimaryField.onChange}
              error={darkPrimaryField.errors?.[0]}
            />
            <ThemeColorPicker
              label="Dark secondary color"
              value={darkSecondaryField.input ?? ""}
              onChange={darkSecondaryField.onChange}
              error={darkSecondaryField.errors?.[0]}
            />
          </section>
        </div>
      </fieldset>

      <ImageEditor
        label="Light theme logo"
        imageUrl={images.urlFor(lightLogoKey)}
        groups={images.groups}
        isLoading={images.isLoading}
        error={images.error}
        validationError={lightLogoFileField.errors?.[0]}
        onFileSelect={(file) => {
          lightLogoFileField.onChange(file);
          if (file) {
            existingLightLogoField.onChange(undefined);
            removeLightLogoField.onChange(false);
          }
        }}
        onExistingImageSelect={(key) => {
          existingLightLogoField.onChange(key);
          if (key) {
            lightLogoFileField.onChange(undefined);
            removeLightLogoField.onChange(false);
          }
        }}
        onRemove={() => removeLightLogoField.onChange(true)}
      />
      <ImageEditor
        label="Dark theme logo"
        imageUrl={images.urlFor(darkLogoKey)}
        groups={images.groups}
        isLoading={images.isLoading}
        error={images.error}
        validationError={darkLogoFileField.errors?.[0]}
        onFileSelect={(file) => {
          darkLogoFileField.onChange(file);
          if (file) {
            existingDarkLogoField.onChange(undefined);
            removeDarkLogoField.onChange(false);
          }
        }}
        onExistingImageSelect={(key) => {
          existingDarkLogoField.onChange(key);
          if (key) {
            darkLogoFileField.onChange(undefined);
            removeDarkLogoField.onChange(false);
          }
        }}
        onRemove={() => removeDarkLogoField.onChange(true)}
      />
    </>
  );
};
