import { useLanguages } from "@hooks/useAppInit";
import { useGetAllImagesByType } from "@hooks/useImages";
import { useGetTranslationsAllLangs } from "@hooks/useTranslations";
import type { ExistingImageGroup } from "@apptypes/image";
import type { Translation } from "@apptypes/translation";
import { BuildingForm } from "./DashboardForm/BuildingForm";
import { OrganisationForm } from "./DashboardForm/OrganisationForm";
import { SiteForm } from "./DashboardForm/SiteForm";
import type {
  EntityEditFormProps,
  ImageFormData,
  TranslationFormData,
} from "./DashboardForm/types";

const toTranslationRecord = (translations: Translation[] | undefined) =>
  Object.fromEntries(
    (translations ?? []).map((translation) => [
      translation.language_code,
      translation.text_value,
    ]),
  );

export const EntityEditForm = (props: EntityEditFormProps) => {
  const imageType = props.entity === "organisation" ? "logo" : props.entity;
  const nameTranslationKey = props.entity !== "organisation" ? props.data.nameTranslationKey : undefined;
  const descriptionTranslationKey = props.entity !== "organisation"
      ? props.data.descriptionTranslationKey
      : undefined;
  const welcomeTranslationKey = props.entity === "site" ? props.data.welcomeTranslationKey : undefined;
  const languages = useLanguages({ enabled: props.entity !== "organisation" });
  const images = useGetAllImagesByType(imageType);
  const nameTranslations = useGetTranslationsAllLangs(nameTranslationKey, {
    enabled: props.entity !== "organisation",
  });
  const descriptionTranslations = useGetTranslationsAllLangs(
    descriptionTranslationKey,
    { enabled: props.entity !== "organisation" },
  );
  const welcomeTranslations = useGetTranslationsAllLangs(
    welcomeTranslationKey,
    { enabled: props.entity === "site" },
  );

  const needsTranslations = props.entity !== "organisation";
  const isLoading =
    images.isLoading ||
    (needsTranslations &&
      (languages.isLoading ||
        nameTranslations.isLoading ||
        descriptionTranslations.isLoading ||
        (props.entity === "site" && welcomeTranslations.isLoading)));
  const hasError =
    images.isError ||
    (needsTranslations &&
      (languages.isError ||
        nameTranslations.isError ||
        descriptionTranslations.isError ||
        (props.entity === "site" && welcomeTranslations.isError)));

  if (isLoading) {
    return (
      <p className="py-10 text-center text-gray-400">
        Loading editable fields…
      </p>
    );
  }
  if (hasError) {
    return (
      <p className="py-10 text-center text-red-300" role="alert">
        The editable images or translations could not be loaded.
      </p>
    );
  }

  const selectableImages = (images.data?.data ?? [])
    .filter((image) => !!image.url)
    .map((image) => ({ ...image, type: imageType }));
  const imageGroups: ExistingImageGroup[] = [
    { label: `Existing ${imageType} images`, images: selectableImages },
  ];
  const imageUrlFor = (key: string) =>
    images.data?.data.find((image) => image.key === key)?.url;
  const imageData: ImageFormData = {
    groups: imageGroups,
    isLoading: images.isLoading,
    error: images.error,
    urlFor: imageUrlFor,
  };
  const translationData: TranslationFormData = {
    languages: languages.data ?? [],
    values: {
      name: toTranslationRecord(nameTranslations.data),
      description: toTranslationRecord(descriptionTranslations.data),
      welcome: toTranslationRecord(welcomeTranslations.data),
    },
  };

  if (props.entity === "organisation") {
    return (
      <OrganisationForm
        entityId={props.entityId}
        data={props.data}
        images={imageData}
        onClose={props.onClose}
      />
    );
  }

  if (props.entity === "site") {
    return (
      <SiteForm
        entityId={props.entityId}
        data={{
          ...props.data,
          nameTranslationKey,
          descriptionTranslationKey,
          welcomeTranslationKey,
        }}
        images={imageData}
        translations={translationData}
        onClose={props.onClose}
      />
    );
  }
  return (
    <BuildingForm
      entityId={props.entityId}
      data={{
        ...props.data,
        nameTranslationKey,
        descriptionTranslationKey,
      }}
      images={imageData}
      translations={translationData}
      onClose={props.onClose}
    />
  );
};
