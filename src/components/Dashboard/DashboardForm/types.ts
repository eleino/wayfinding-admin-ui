import type { ExistingImageGroup } from "@apptypes/image";
import type { OrganisationType, ThemeJson } from "@apptypes/organisation";

export interface OrganisationFormData {
  name: string;
  themeJson?: ThemeJson | null;
  lightLogoKey?: string;
  darkLogoKey?: string;
}

export interface SiteFormData {
  name: string;
  address: string;
  imageKey?: string | null;
  nameTranslationKey?: string;
  descriptionTranslationKey?: string;
  welcomeTranslationKey?: string;
}

export interface BuildingFormData {
  name: string;
  floorCount: number;
  allowedOrganisations: number[];
  organisations: OrganisationType[];
  imageKey?: string | null;
  nameTranslationKey?: string;
  descriptionTranslationKey?: string;
}

interface EntityEditFormBaseProps {
  entityId: number;
  onClose: () => void;
}

export type EntityEditFormProps = EntityEditFormBaseProps &
  (
    | { entity: "organisation"; data: OrganisationFormData }
    | { entity: "site"; data: SiteFormData }
    | { entity: "building"; data: BuildingFormData }
  );

export interface ImageFormData {
  groups: ExistingImageGroup[];
  isLoading: boolean;
  error: Error | null;
  urlFor: (key: string) => string | undefined;
}

export interface TranslationFormData {
  languages: Array<{ code: string; name: string }>;
  values: {
    name: Record<string, string>;
    description: Record<string, string>;
    welcome: Record<string, string>;
  };
}
