import { Form, useForm } from "@formisch/react";
import { useGetAllImagesByType } from "@hooks/useImages";
import { useLanguages } from "@hooks/useAppInit";
import { useDashboardEntityCreator } from "@hooks/useDashboardEntityCreator";
import { useSelectionStore } from "@storage/store";
import type { OrganisationType } from "@apptypes/organisation";
import {
  BuildingEditSchema,
  OrganisationEditSchema,
  SiteEditSchema,
  type BuildingEditInput,
  type OrganisationEditInput,
  type SiteEditInput,
} from "@schemas/dashboard-entity.schema";
import type { ImageFormData, TranslationFormData } from "./DashboardForm/types";
import { OrganisationFields } from "./DashboardForm/OrganisationFields";
import { SiteFields } from "./DashboardForm/SiteFields";
import { BuildingFields } from "./DashboardForm/BuildingFields";
import type { DashboardEntity } from "./EntityModal";

interface NewEntityModalProps {
  entity: DashboardEntity;
  organisationId?: number;
  siteId?: number;
  organisations: OrganisationType[];
  onClose: () => void;
}

const entityLabel: Record<DashboardEntity, string> = {
  organisation: "organisation",
  site: "site",
  building: "building",
};

const initialTranslations = (languages: TranslationFormData["languages"]) =>
  languages.map((language) => ({
    language_code: language.code,
    text_value: "",
  }));

export const NewEntityModal = ({
  entity,
  organisationId,
  siteId,
  organisations,
  onClose,
}: NewEntityModalProps) => {
  const imageType = entity === "organisation" ? "logo" : entity;
  const images = useGetAllImagesByType(imageType);
  const languages = useLanguages({ enabled: entity !== "organisation" });
  const creator = useDashboardEntityCreator();

  const selectableImages = (images.data?.data ?? [])
    .filter((image) => !!image.url)
    .map((image) => ({ ...image, type: imageType }));
  const imageData: ImageFormData = {
    groups: [{ label: `Existing ${imageType} images`, images: selectableImages }],
    isLoading: images.isLoading,
    error: images.error,
    urlFor: () => undefined,
  };
  const translationData: TranslationFormData = {
    languages: languages.data ?? [],
    values: { name: {}, description: {}, welcome: {} },
  };

  const close = () => {
    if (!creator.isPending) onClose();
  };

  const onOrganisationSubmit = async (values: OrganisationEditInput) => {
    if (!organisationId) return;
    try {
      const created = await creator.mutateAsync({
        entity: "organisation",
        parentId: organisationId,
        values,
      });
      useSelectionStore.getState().setOrgId(created.id);
      onClose();
    } catch {
      // The mutation error is shown below and the form remains available to retry.
    }
  };

  const onSiteSubmit = async (values: SiteEditInput) => {
    if (!organisationId) return;
    try {
      const created = await creator.mutateAsync({
        entity: "site",
        organisationId,
        values,
      });
      useSelectionStore.getState().setSiteId(created.id);
      onClose();
    } catch {
      // The mutation error is shown below and the form remains available to retry.
    }
  };

  const onBuildingSubmit = async (values: BuildingEditInput) => {
    if (!siteId) return;
    try {
      const created = await creator.mutateAsync({
        entity: "building",
        siteId,
        values,
      });
      useSelectionStore.getState().setBuildingId(created.id);
      onClose();
    } catch {
      // The mutation error is shown below and the form remains available to retry.
    }
  };

  const isLoading =
    images.isLoading || (entity !== "organisation" && languages.isLoading);
  const hasLoadError =
    images.isError || (entity !== "organisation" && languages.isError);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-entity-modal-title"
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-border-grey bg-sidebar-grey p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="new-entity-modal-title" className="text-2xl font-semibold">
              Add {entityLabel[entity]}
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              {entity === "organisation" && "The new organisation will be added below the selected organisation."}
              {entity === "site" && "The new site will belong to the selected organisation."}
              {entity === "building" && "The new building will belong to the selected site."}
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close dialog"
            disabled={creator.isPending}
            className="h-9 w-9 cursor-pointer rounded border border-border-grey text-xl hover:border-lab-turquoise hover:text-lab-turquoise disabled:cursor-not-allowed disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {isLoading && <p className="py-10 text-center text-gray-400">Loading form options…</p>}
        {hasLoadError && (
          <p className="py-10 text-center text-red-300" role="alert">
            The available images or languages could not be loaded.
          </p>
        )}
        {!isLoading && !hasLoadError && entity === "organisation" && (
          <NewOrganisationForm
            images={imageData}
            isCreating={creator.isPending}
            loadingMessage={creator.loadingMessage}
            hasError={creator.isError}
            onClose={close}
            onSubmit={onOrganisationSubmit}
          />
        )}
        {!isLoading && !hasLoadError && entity === "site" && (
          <NewSiteForm
            images={imageData}
            languages={translationData.languages}
            isCreating={creator.isPending}
            loadingMessage={creator.loadingMessage}
            hasError={creator.isError}
            onClose={close}
            onSubmit={onSiteSubmit}
          />
        )}
        {!isLoading && !hasLoadError && entity === "building" && (
          <NewBuildingForm
            images={imageData}
            languages={translationData.languages}
            organisations={organisations}
            initialOrganisationId={organisationId}
            isCreating={creator.isPending}
            loadingMessage={creator.loadingMessage}
            hasError={creator.isError}
            onClose={close}
            onSubmit={onBuildingSubmit}
          />
        )}
      </section>
    </div>
  );
};

const CreateActions = ({
  isCreating,
  loadingMessage,
  hasError,
  entity,
  onClose,
}: {
  isCreating: boolean;
  loadingMessage: string | null;
  hasError: boolean;
  entity: DashboardEntity;
  onClose: () => void;
}) => (
  <>
    {hasError && (
      <p className="text-sm text-red-300" role="alert">
        The {entityLabel[entity]} could not be created. Please try again.
      </p>
    )}
    <div className="flex justify-end gap-2 pt-3">
      <button
        type="button"
        onClick={onClose}
        disabled={isCreating}
        className="cursor-pointer rounded border border-border-grey px-4 py-2 hover:border-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isCreating}
        className="cursor-pointer rounded bg-lab-blue px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isCreating ? (loadingMessage ?? "Creating…") : `Add ${entityLabel[entity]}`}
      </button>
    </div>
  </>
);

const NewOrganisationForm = ({
  images,
  isCreating,
  loadingMessage,
  hasError,
  onClose,
  onSubmit,
}: {
  images: ImageFormData;
  isCreating: boolean;
  loadingMessage: string | null;
  hasError: boolean;
  onClose: () => void;
  onSubmit: (values: OrganisationEditInput) => Promise<void>;
}) => {
  const form = useForm({
    schema: OrganisationEditSchema,
    initialInput: {
      name: "",
      lightPrimaryColor: "",
      lightSecondaryColor: "",
      darkPrimaryColor: "",
      darkSecondaryColor: "",
      lightLogoFile: undefined,
      existingLightLogoKey: undefined,
      removeLightLogo: false,
      darkLogoFile: undefined,
      existingDarkLogoKey: undefined,
      removeDarkLogo: false,
    },
    validate: "blur",
  });

  return (
    <Form of={form} className="mt-5 space-y-5" onSubmit={onSubmit}>
      <OrganisationFields form={form} lightLogoKey="" darkLogoKey="" images={images} />
      <CreateActions isCreating={isCreating} loadingMessage={loadingMessage} hasError={hasError} entity="organisation" onClose={onClose} />
    </Form>
  );
};

const NewSiteForm = ({
  images,
  languages,
  isCreating,
  loadingMessage,
  hasError,
  onClose,
  onSubmit,
}: {
  images: ImageFormData;
  languages: TranslationFormData["languages"];
  isCreating: boolean;
  loadingMessage: string | null;
  hasError: boolean;
  onClose: () => void;
  onSubmit: (values: SiteEditInput) => Promise<void>;
}) => {
  const form = useForm({
    schema: SiteEditSchema,
    initialInput: {
      name: "",
      address: "",
      nameTranslations: initialTranslations(languages),
      descriptionTranslations: initialTranslations(languages),
      welcomeTranslations: initialTranslations(languages),
      imageFile: undefined,
      existingImageKey: undefined,
      removeImage: false,
    },
    validate: "blur",
  });

  return (
    <Form of={form} className="mt-5 space-y-5" onSubmit={onSubmit}>
      <SiteFields form={form} imageKey="" images={images} languages={languages} />
      <CreateActions isCreating={isCreating} loadingMessage={loadingMessage} hasError={hasError} entity="site" onClose={onClose} />
    </Form>
  );
};

const NewBuildingForm = ({
  images,
  languages,
  organisations,
  initialOrganisationId,
  isCreating,
  loadingMessage,
  hasError,
  onClose,
  onSubmit,
}: {
  images: ImageFormData;
  languages: TranslationFormData["languages"];
  organisations: OrganisationType[];
  initialOrganisationId?: number;
  isCreating: boolean;
  loadingMessage: string | null;
  hasError: boolean;
  onClose: () => void;
  onSubmit: (values: BuildingEditInput) => Promise<void>;
}) => {
  const form = useForm({
    schema: BuildingEditSchema,
    initialInput: {
      name: "",
      totalFloors: 1,
      allowedOrganisations: initialOrganisationId ? [initialOrganisationId] : [],
      nameTranslations: initialTranslations(languages),
      descriptionTranslations: initialTranslations(languages),
      imageFile: undefined,
      existingImageKey: undefined,
      removeImage: false,
    },
    validate: "blur",
  });

  return (
    <Form of={form} className="mt-5 space-y-5" onSubmit={onSubmit}>
      <BuildingFields
        form={form}
        imageKey=""
        images={images}
        languages={languages}
        organisations={organisations}
      />
      <CreateActions isCreating={isCreating} loadingMessage={loadingMessage} hasError={hasError} entity="building" onClose={onClose} />
    </Form>
  );
};
