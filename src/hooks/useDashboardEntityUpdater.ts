import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { updateOrganisation, updateOrganisationSettings } from "@api/organisations";
import { updateSite } from "@api/sites";
import { updateBuilding } from "@api/buildings";
import { copyImage, deleteImage, uploadImage } from "@api/images";
import {
  createTranslation,
  deleteTranslation,
  updateTranslation,
} from "@api/translations";
import type { UpdateOrganisationDTO } from "@apptypes/dtos/update-organisation.dto";
import type { UpdateSiteDTO } from "@apptypes/dtos/update-site.dto";
import type { UpdateBuildingDTO } from "@apptypes/dtos/update-building.dto";

export interface DashboardTranslationChange {
  key: string;
  type: string;
  existing: Record<string, string>;
  values: Array<{ language_code: string; text_value: string }>;
}

export interface DashboardImageChange {
  itemType: "logo" | "site" | "building";
  key: string;
  itemId: number;
  file?: File;
  sourceKey?: string;
  remove?: boolean;
  currentExists: boolean;
}

type DashboardEntityUpdate =
  | {
      entity: "organisation";
      id: number;
      values: UpdateOrganisationDTO | null;
      themeJson: string;
      initialThemeJson: string;
      images: DashboardImageChange[];
      translations: [];
    }
  | {
      entity: "site";
      id: number;
      values: UpdateSiteDTO | null;
      images: DashboardImageChange[];
      translations: DashboardTranslationChange[];
    }
  | {
      entity: "building";
      id: number;
      values: UpdateBuildingDTO | null;
      images: DashboardImageChange[];
      translations: DashboardTranslationChange[];
    };

const saveImage = async (change: DashboardImageChange) => {
  if (change.file) {
    return uploadImage(change.itemType, change.key, change.file, change.itemId);
  }

  if (change.sourceKey && change.sourceKey !== change.key) {
    return copyImage(
      change.sourceKey,
      change.itemType,
      change.key,
      change.itemId,
    );
  }

  if (change.remove && change.currentExists) {
    return deleteImage(change.key);
  }

  return undefined;
};

const saveTranslation = async (change: DashboardTranslationChange) => {
  const operations: Array<Promise<unknown>> = [];

  for (const translation of change.values) {
    const textValue = translation.text_value.trim();
    const existingValue = change.existing[translation.language_code];

    if (!textValue && existingValue !== undefined) { // deleted translation
      operations.push(deleteTranslation(change.key, translation.language_code));
      continue;
    }
    if (!textValue) continue;
    if (existingValue === undefined) { // new translation
      operations.push(
        createTranslation({
          translation_key: change.key,
          language_code: translation.language_code,
          type: change.type,
          text_value: textValue,
        }),
      );
      continue;
    }
    if (existingValue !== textValue) { // updated translation
      operations.push(
        updateTranslation(
          change.key,
          { text_value: textValue },
          translation.language_code,
        ),
      );
    }
  }

  return Promise.all(operations);
};

export const useDashboardEntityUpdater = () => {
  const queryClient = useQueryClient();
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (update: DashboardEntityUpdate) => {
      setLoadingMessage(`Updating ${update.entity}...`);
      if (update.entity === "organisation" && update.values) {
        await updateOrganisation({ id: update.id, organisation: update.values });
      } else if (update.entity === "site" && update.values) {
        await updateSite({ id: update.id, site: update.values });
      } else if (update.entity === "building" && update.values) {
        await updateBuilding({ id: update.id, building: update.values });
      }

      if (
        update.entity === "organisation" &&
        update.themeJson !== update.initialThemeJson
      ) {
        setLoadingMessage("Saving organisation settings...");
        await updateOrganisationSettings(update.id, update.themeJson);
      }

      if (update.images.length > 0) {
        setLoadingMessage("Saving images...");
        await Promise.all(update.images.map(saveImage));
      }

      if (update.translations.length > 0) {
        setLoadingMessage("Saving translations...");
        await Promise.all(update.translations.map(saveTranslation));
      }
    },
    onSuccess: (_data, update) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["organisations"] }),
        queryClient.invalidateQueries({ queryKey: ["sites"] }),
        queryClient.invalidateQueries({ queryKey: ["buildings"] }),
        ...update.images.map((image) =>
          queryClient.invalidateQueries({
            queryKey: ["all_images", image.itemType],
          }),
        ),
        ...update.translations.map((translation) =>
          queryClient.invalidateQueries({
            queryKey: ["translationsAllLangs", translation.key],
          }),
        ),
      ]),
    onSettled: () => setLoadingMessage(null),
  });

  return { ...mutation, loadingMessage };
};
