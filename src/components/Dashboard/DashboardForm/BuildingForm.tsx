import { Form, useForm } from "@formisch/react";
import { useDashboardEntityUpdater } from "@hooks/useDashboardEntityUpdater";
import {
  BuildingEditSchema,
  type BuildingEditInput,
} from "@schemas/dashboard-entity.schema";
import { BuildingFields } from "./BuildingFields";
import { SaveActions } from "./shared";
import type {
  BuildingFormData,
  ImageFormData,
  TranslationFormData,
} from "./types";
import { sameIds } from "./utils";

interface BuildingFormProps {
  entityId: number;
  data: BuildingFormData;
  images: ImageFormData;
  translations: TranslationFormData;
  onClose: () => void;
}

export const BuildingForm = ({
  entityId,
  data,
  images,
  translations,
  onClose,
}: BuildingFormProps) => {
  const {
    name: initialName,
    floorCount: initialFloorCount,
    allowedOrganisations: initialAllowedOrganisations,
    organisations,
    imageKey,
    nameTranslationKey,
    descriptionTranslationKey,
  } = data;
  const { languages, values: translationValues } = translations;
  const resolvedImageKey = imageKey || `BUILDING_${entityId}_IMG`;
  const resolvedNameKey = nameTranslationKey ?? `BUILDING_${entityId}_NAME`;
  const resolvedDescriptionKey =
    descriptionTranslationKey ?? `BUILDING_${entityId}_DESC`;
  const updater = useDashboardEntityUpdater();
  const form = useForm({
    schema: BuildingEditSchema,
    initialInput: {
      name: initialName,
      totalFloors: initialFloorCount,
      allowedOrganisations: initialAllowedOrganisations,
      nameTranslations: languages.map((language) => ({
        language_code: language.code,
        text_value: translationValues.name[language.code] ?? "",
      })),
      descriptionTranslations: languages.map((language) => ({
        language_code: language.code,
        text_value: translationValues.description[language.code] ?? "",
      })),
      imageFile: undefined,
      existingImageKey: undefined,
      removeImage: false,
    },
    validate: "blur",
  });

  const handleSubmit = async (values: BuildingEditInput) => {
    updater.reset();
    const coreChanged =
      values.name !== initialName ||
      values.totalFloors !== initialFloorCount ||
      !sameIds(values.allowedOrganisations, initialAllowedOrganisations);
    try {
      await updater.mutateAsync({
        entity: "building",
        id: entityId,
        values: coreChanged
          ? {
              name: values.name,
              total_floors: values.totalFloors,
              organizations: values.allowedOrganisations,
            }
          : null,
        images: [
          {
            itemType: "building",
            key: resolvedImageKey,
            itemId: entityId,
            file: values.imageFile,
            sourceKey: values.existingImageKey,
            remove: values.removeImage,
            currentExists: !!images.urlFor(resolvedImageKey),
          },
        ],
        translations: [
          {
            key: resolvedNameKey,
            type: "building_name",
            existing: translationValues.name,
            values: values.nameTranslations,
          },
          {
            key: resolvedDescriptionKey,
            type: "building_desc",
            existing: translationValues.description,
            values: values.descriptionTranslations,
          },
        ],
      });
      onClose();
    } catch {
      // The mutation exposes the error below and keeps the form open for retrying.
    }
  };

  return (
    <Form of={form} className="mt-5 space-y-5" onSubmit={handleSubmit}>
      <BuildingFields
        form={form}
        imageKey={resolvedImageKey}
        images={images}
        languages={languages}
        organisations={organisations}
      />
      <SaveActions
        isSaving={updater.isPending}
        loadingMessage={updater.loadingMessage}
        hasError={updater.isError}
        hasChanges={form.isDirty}
        onClose={onClose}
      />
    </Form>
  );
};
