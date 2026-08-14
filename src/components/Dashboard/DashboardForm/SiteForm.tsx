import { Form, useForm } from "@formisch/react";
import {
  useDashboardEntityUpdater,
  type DashboardTranslationChange,
} from "@hooks/useDashboardEntityUpdater";
import {
  SiteEditSchema,
  type SiteEditInput,
} from "@schemas/dashboard-entity.schema";
import { SaveActions } from "./shared";
import { SiteFields } from "./SiteFields";
import type {
  ImageFormData,
  SiteFormData,
  TranslationFormData,
} from "./types";

interface SiteFormProps {
  entityId: number;
  data: SiteFormData;
  images: ImageFormData;
  translations: TranslationFormData;
  onClose: () => void;
}

export const SiteForm = ({
  entityId,
  data,
  images,
  translations,
  onClose,
}: SiteFormProps) => {
  const {
    name: initialName,
    address: initialAddress,
    imageKey,
    nameTranslationKey,
    descriptionTranslationKey,
    welcomeTranslationKey,
  } = data;
  const { languages, values: translationValues } = translations;
  const resolvedImageKey = imageKey ?? `SITE_${entityId}_IMG`;
  const resolvedNameKey = nameTranslationKey ?? `SITE_${entityId}_NAME`;
  const resolvedDescriptionKey =
    descriptionTranslationKey ?? `SITE_${entityId}_DESC`;
  const resolvedWelcomeKey =
    welcomeTranslationKey ?? `SITE_${entityId}_WELCOME`;
  const updater = useDashboardEntityUpdater();

  const form = useForm({
    schema: SiteEditSchema,
    initialInput: {
      name: initialName,
      address: initialAddress,
      nameTranslations: languages.map((language) => ({
        language_code: language.code,
        text_value: translationValues.name[language.code] ?? "",
      })),
      descriptionTranslations: languages.map((language) => ({
        language_code: language.code,
        text_value: translationValues.description[language.code] ?? "",
      })),
      welcomeTranslations: languages.map((language) => ({
        language_code: language.code,
        text_value: translationValues.welcome[language.code] ?? "",
      })),
      imageFile: undefined,
      existingImageKey: undefined,
      removeImage: false,
    },
    validate: "blur",
  });

  const handleSubmit = async (values: SiteEditInput) => {
    updater.reset();
    const coreChanged =
      values.name !== initialName || values.address !== initialAddress;
    const translationChanges: DashboardTranslationChange[] = [
      {
        key: resolvedNameKey,
        type: "site_name",
        existing: translationValues.name,
        values: values.nameTranslations,
      },
      {
        key: resolvedDescriptionKey,
        type: "site_desc",
        existing: translationValues.description,
        values: values.descriptionTranslations,
      },
      {
        key: resolvedWelcomeKey,
        type: "site_welcome",
        existing: translationValues.welcome,
        values: values.welcomeTranslations,
      },
    ];

    try {
      await updater.mutateAsync({
        entity: "site",
        id: entityId,
        values: coreChanged
          ? { name: values.name, address: values.address }
          : null,
        images: [
          {
            itemType: "site",
            key: resolvedImageKey,
            itemId: entityId,
            file: values.imageFile,
            sourceKey: values.existingImageKey,
            remove: values.removeImage,
            currentExists: !!images.urlFor(resolvedImageKey),
          },
        ],
        translations: translationChanges,
      });
      onClose();
    } catch {
      // The mutation exposes the error below and keeps the form open for retrying.
    }
  };

  return (
    <Form of={form} className="mt-5 space-y-5" onSubmit={handleSubmit}>
      <SiteFields
        form={form}
        imageKey={resolvedImageKey}
        images={images}
        languages={languages}
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
