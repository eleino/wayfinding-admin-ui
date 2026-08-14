import { Form, useForm } from "@formisch/react";
import {
  useDashboardEntityUpdater,
  type DashboardImageChange,
} from "@hooks/useDashboardEntityUpdater";
import {
  OrganisationEditSchema,
  type OrganisationEditInput,
} from "@schemas/dashboard-entity.schema";
// import { buildThemeJson, getThemeColor, parseThemeJson } from "./theme";
import { SaveActions } from "./shared";
import type { ImageFormData, OrganisationFormData } from "./types";
import { OrganisationFields } from "./OrganisationFields";
import { buildThemeJson, getThemeColor } from "./utils";

interface OrganisationFormProps {
  entityId: number;
  data: OrganisationFormData;
  images: ImageFormData;
  onClose: () => void;
}

export const OrganisationForm = ({
  entityId,
  data,
  images,
  onClose,
}: OrganisationFormProps) => {
  const {
    name: initialName,
    themeJson: initialThemeJson,
    lightLogoKey,
    darkLogoKey,
  } = data;
  const imageUrlFor = images.urlFor;
  const updater = useDashboardEntityUpdater();
  const resolvedLightKey = lightLogoKey ?? `ORGANIZATION_${entityId}_LOGO_LIGHT`;
  const resolvedDarkKey = darkLogoKey ?? `ORGANIZATION_${entityId}_LOGO_DARK`;
  const initialTheme = initialThemeJson || {};

  const initialColors = {
    lightPrimaryColor: getThemeColor(initialTheme, "light", "primary"),
    lightSecondaryColor: getThemeColor(initialTheme, "light", "secondary"),
    darkPrimaryColor: getThemeColor(initialTheme, "dark", "primary"),
    darkSecondaryColor: getThemeColor(initialTheme, "dark", "secondary"),
  };
  const serializedInitialTheme = JSON.stringify(initialTheme);
  const form = useForm({
    schema: OrganisationEditSchema,
    initialInput: {
      name: initialName,
      ...initialColors,
      lightLogoFile: undefined,
      existingLightLogoKey: undefined,
      removeLightLogo: false,
      darkLogoFile: undefined,
      existingDarkLogoKey: undefined,
      removeDarkLogo: false,
    },
    validate: "blur",
  });

  const handleSubmit = async (values: OrganisationEditInput) => {
    updater.reset();
    const colors = {
      lightPrimaryColor: values.lightPrimaryColor,
      lightSecondaryColor: values.lightSecondaryColor,
      darkPrimaryColor: values.darkPrimaryColor,
      darkSecondaryColor: values.darkSecondaryColor,
    };
    const colorsChanged = Object.entries(colors).some(
      ([key, value]) => value !== initialColors[key as keyof typeof initialColors],
    );
    const themeJson = colorsChanged
      ? buildThemeJson(colors)
      : serializedInitialTheme;
    const imageChanges: DashboardImageChange[] = [
      {
        itemType: "logo",
        key: resolvedLightKey,
        itemId: entityId,
        file: values.lightLogoFile,
        sourceKey: values.existingLightLogoKey,
        remove: values.removeLightLogo,
        currentExists: !!imageUrlFor(resolvedLightKey),
      },
      {
        itemType: "logo",
        key: resolvedDarkKey,
        itemId: entityId,
        file: values.darkLogoFile,
        sourceKey: values.existingDarkLogoKey,
        remove: values.removeDarkLogo,
        currentExists: !!imageUrlFor(resolvedDarkKey),
      },
    ];

    try {
      await updater.mutateAsync({
        entity: "organisation",
        id: entityId,
        values: values.name === initialName ? null : { name: values.name },
        themeJson,
        initialThemeJson: serializedInitialTheme,
        images: imageChanges,
        translations: [],
      });
      onClose();
    } catch {
      // The mutation exposes the error below and keeps the form open for retrying.
    }
  };

  return (
    <Form of={form} className="mt-5 space-y-5" onSubmit={handleSubmit}>
      <OrganisationFields
        form={form}
        lightLogoKey={resolvedLightKey}
        darkLogoKey={resolvedDarkKey}
        images={images}
      />
      <SaveActions
        isSaving={updater.isPending}
        hasError={updater.isError}
        hasChanges={form.isDirty}
        onClose={onClose}
      />
    </Form>
  );
};
