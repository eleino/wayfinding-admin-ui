import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createOrganisation, updateOrganisationSettings } from "@api/organisations";
import { createSite } from "@api/sites";
import { createBuilding } from "@api/buildings";
import { copyImage, uploadImage } from "@api/images";
import { createTranslation } from "@api/translations";
import type {
  OrganisationEditInput,
  SiteEditInput,
  BuildingEditInput,
} from "@schemas/dashboard-entity.schema";
import { buildThemeJson } from "@components/Dashboard/DashboardForm/utils";

type ImageType = "logo" | "site" | "building";

const saveNewImage = async ({
  itemType,
  key,
  itemId,
  file,
  sourceKey,
}: {
  itemType: ImageType;
  key: string;
  itemId: number;
  file?: File;
  sourceKey?: string;
}) => {
  if (file) return uploadImage(itemType, key, file, itemId);
  if (sourceKey && sourceKey !== key) {
    return copyImage(sourceKey, itemType, key, itemId);
  }
  return undefined;
};

const saveNewTranslations = (
  key: string,
  type: string,
  values: Array<{ language_code: string; text_value: string }>,
) =>
  Promise.all(
    values
      .filter((translation) => translation.text_value.trim().length > 0)
      .map((translation) =>
        createTranslation({
          translation_key: key,
          type,
          ...translation,
        }),
      ),
  );

type DashboardEntityCreation =
  | {
      entity: "organisation";
      parentId: number;
      values: OrganisationEditInput;
    }
  | {
      entity: "site";
      organisationId: number;
      values: SiteEditInput;
    }
  | {
      entity: "building";
      siteId: number;
      values: BuildingEditInput;
    };

export const useDashboardEntityCreator = () => {
  const queryClient = useQueryClient();
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (creation: DashboardEntityCreation) => {
      if (creation.entity === "organisation") {
        setLoadingMessage("Creating organisation...");
        const created = await createOrganisation(creation.parentId, {
          name: creation.values.name,
        });
        const id = created.organization_id;
        const colors = {
          lightPrimaryColor: creation.values.lightPrimaryColor,
          lightSecondaryColor: creation.values.lightSecondaryColor,
          darkPrimaryColor: creation.values.darkPrimaryColor,
          darkSecondaryColor: creation.values.darkSecondaryColor,
        };

        if (Object.values(colors).some(Boolean)) {
          setLoadingMessage("Saving organisation settings...");
          await updateOrganisationSettings(id, buildThemeJson(colors));
        }

        setLoadingMessage("Saving organisation images...");
        await Promise.all([
          saveNewImage({
            itemType: "logo",
            key: created.logo_image_key_light,
            itemId: id,
            file: creation.values.lightLogoFile,
            sourceKey: creation.values.existingLightLogoKey,
          }),
          saveNewImage({
            itemType: "logo",
            key: created.logo_image_key_dark,
            itemId: id,
            file: creation.values.darkLogoFile,
            sourceKey: creation.values.existingDarkLogoKey,
          }),
        ]);
        return { entity: creation.entity, id };
      }

      if (creation.entity === "site") {
        setLoadingMessage("Creating site...");
        const created = await createSite(creation.organisationId, {
          name: creation.values.name,
          address: creation.values.address,
        });
        const id = created.site_id;

        setLoadingMessage("Saving site image...");
        await saveNewImage({
            itemType: "site",
            key: created.img_site_key,
            itemId: id,
            file: creation.values.imageFile,
            sourceKey: creation.values.existingImageKey,
        });
        setLoadingMessage("Creating site translations...");
        await Promise.all([
          saveNewTranslations(
            created.trl_site_name_key,
            "site_name",
            creation.values.nameTranslations,
          ),
          saveNewTranslations(
            created.trl_site_desc_Key,
            "site_desc",
            creation.values.descriptionTranslations,
          ),
          saveNewTranslations(
            created.trl_site_welcome_msg_key,
            "site_welcome",
            creation.values.welcomeTranslations,
          ),
        ]);
        return { entity: creation.entity, id };
      }

      setLoadingMessage("Creating building...");
      const created = await createBuilding(creation.siteId, {
        name: creation.values.name,
        total_floors: creation.values.totalFloors,
        organizations: creation.values.allowedOrganisations,
      });
      const id = created.building_id;

      setLoadingMessage("Saving building image...");
      await saveNewImage({
        itemType: "building",
        key: created.img_building_key,
        itemId: id,
        file: creation.values.imageFile,
        sourceKey: creation.values.existingImageKey,
      });
      setLoadingMessage("Creating building translations...");
      await Promise.all([
        saveNewTranslations(
          created.trl_building_name_key,
          "building_name",
          creation.values.nameTranslations,
        ),
        saveNewTranslations(
          created.trl_building_desc_key,
          "building_desc",
          creation.values.descriptionTranslations,
        ),
      ]);
      return { entity: creation.entity, id };
    },
    onSuccess: (_data, creation) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["organisations"] }),
        queryClient.invalidateQueries({ queryKey: ["sites"] }),
        queryClient.invalidateQueries({ queryKey: ["buildings"] }),
        queryClient.invalidateQueries({ queryKey: ["all_images", "logo"] }),
        queryClient.invalidateQueries({ queryKey: ["all_images", "site"] }),
        queryClient.invalidateQueries({ queryKey: ["all_images", "building"] }),
        ...(creation.entity === "site"
          ? [
              queryClient.invalidateQueries({
                queryKey: ["organisations", creation.organisationId],
              }),
            ]
          : []),
      ]),
    onSettled: () => setLoadingMessage(null),
  });

  return { ...mutation, loadingMessage };
};
