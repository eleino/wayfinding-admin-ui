import { useQueryClient } from "@tanstack/react-query";
// import { useNavigate } from "@tanstack/react-router";
import { useCreateTranslation, useUpdateTranslation } from "./useTranslations";
import { useUpdateLocation } from "./useLocations";
import { useUploadImage } from "./useImages";
import { useState, useCallback } from "react";
import type { EditLocationInput } from "@apptypes/location";
import { ApiError, normalizeApiError } from "@api/errors";
import type { Location } from "@apptypes/location";
import type { UploadedImage } from "@apptypes/image";
import type { Translation } from "@apptypes/translation";

interface DataType {
  location: Location;
  image: UploadedImage | null;
  translations: Translation[] | null;
}

export const useLocationUpdater = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [data, setData] = useState<DataType | null>(null);

  const updateLocationMutation = useUpdateLocation();
  const uploadImageMutation = useUploadImage();
  const updateTranslationMutation = useUpdateTranslation();
  const createTranslationMutation = useCreateTranslation();
  const queryClient = useQueryClient();
  // const navigate = useNavigate();
  const mutateAsync = useCallback(
    async (
      locationId: number,
      locationDetails: Location,
      oldLocationData: EditLocationInput,
      updatedLocationData: EditLocationInput,
    ) => {
      if (!locationId) {
        return { error: "Location ID is required" };
      }
      setIsLoading(true);
      setError(null);
      setData(null);
              const nameKey =
          locationDetails.trl_location_name_key ||
          `LOCATION_${locationId}_NAME`;
        const atCurrentLocationMsgKey =
          locationDetails.trl_current_location_msg_key ||
          `CURRENT_LOCATION_${locationId}_MSG`;

      try {
        // check whether any location fields have changed before trying to update them
        const locChanges: Record<string, string | boolean | number> = {};
        if (
          updatedLocationData.location_name !== oldLocationData.location_name
        ) {
          locChanges.name = updatedLocationData.location_name;
        }
        if (
          updatedLocationData.is_entry_location !==
          oldLocationData.is_entry_location
        ) {
          locChanges.is_entry_location = updatedLocationData.is_entry_location;
        }
        if (updatedLocationData.floor_number !== oldLocationData.floor_number) {
          locChanges.floor_number = updatedLocationData.floor_number;
        }
        // handle location update if there are changes
        let locationResult: Location | null = null;
        if (Object.keys(locChanges).length > 0) {
          locationResult = await updateLocationMutation.mutateAsync({
            locationId,
            location: locChanges,
          });
        }

        // handle image update if a new image file is provided
        let imageResult: UploadedImage | null = null;
        if (updatedLocationData.imageFile) {
          const key = locationDetails.img_location_key || `LOCATION_${locationId}_IMG`;
          setLoadingMessage("Uploading image...");
          imageResult = await uploadImageMutation.mutateAsync({
              itemType: "location",
              key,
              file: updatedLocationData.imageFile,
              itemId: locationId,
            });
        }

        // handle translation updates
        setLoadingMessage("Updating translations...");
        let translationResults: Translation[] = [];
        const promises: Promise<Translation>[] = [];
        // check whether translation has changed before trying to update
        // also, if the translation keys didn't exist before, we need to create translations instead of updating
        const changedTranslations = [];
        const newTranslations = [];
        // location name translations
        for (const updatedTranslation of updatedLocationData.trl_location_name) {
          const oldTranslation = oldLocationData.trl_location_name.find(
            (t) => t.lang === updatedTranslation.lang,
          );
          if (updatedTranslation.text === undefined || updatedTranslation.text === '') {
            continue; // Skip if the updated translation text is empty
          }
          if (
            oldTranslation && oldTranslation.text !== undefined && oldTranslation.text !== '' &&
            oldTranslation.text !== updatedTranslation.text
          ) {
            changedTranslations.push({
              key: nameKey,
              lang: updatedTranslation.lang,
              text: updatedTranslation.text,
            });
          } else if (( !oldTranslation || oldTranslation.text === undefined || oldTranslation.text === '' ) && updatedTranslation.text) {
            newTranslations.push({
              translation_key: nameKey,
              language_code: updatedTranslation.lang,
              type: "location_name",
              text_value: updatedTranslation.text,
            });
          }
        }
        // at current location message translations
        for (const updatedTranslation of updatedLocationData.trl_at_current_location_msg) {
          const oldTranslation =
            oldLocationData.trl_at_current_location_msg.find(
              (t) => t.lang === updatedTranslation.lang,
            );
            if (updatedTranslation.text === undefined || updatedTranslation.text === '') {
              continue; // Skip if the updated translation text is empty
            }
          if (
            oldTranslation && oldTranslation.text !== undefined && oldTranslation.text !== '' &&
            oldTranslation.text !== updatedTranslation.text
          ) {
            changedTranslations.push({
              key: atCurrentLocationMsgKey,
              lang: updatedTranslation.lang,
              text: updatedTranslation.text,
            });
          } else if (( !oldTranslation || oldTranslation.text === undefined || oldTranslation.text === '' ) && updatedTranslation.text) {
            newTranslations.push({
              translation_key: atCurrentLocationMsgKey,
              language_code: updatedTranslation.lang,
              type: "at_location_message",
              text_value: updatedTranslation.text,
            });
          }
        }
        // create new translations
        for (const translation of newTranslations) {
          promises.push(createTranslationMutation.mutateAsync(translation));
        }
        // update existing translations
        for (const translation of changedTranslations) {
            promises.push(
              updateTranslationMutation.mutateAsync({
                translationKey: translation.key,
                lang: translation.lang,
                translation: {
                  text_value: translation.text,
                },
              }),
            );
        }
        translationResults = await Promise.all(promises);
        const allData: DataType = {
          location: locationResult ? locationResult : locationDetails,
          image: imageResult || null,
          translations: translationResults || null,
        };
        setData(allData);
        // invalidate query keys, may be missing some still, but this should cover most cases
        queryClient.invalidateQueries({ queryKey: ["location", locationId] });
        queryClient.invalidateQueries({ queryKey: ["translationsAllLangs", nameKey ] });
        queryClient.invalidateQueries({ queryKey: ["translationsAllLangs", atCurrentLocationMsgKey ] });
        queryClient.invalidateQueries({ queryKey: ["locations", locationDetails.building_id] });
        queryClient.invalidateQueries({ queryKey: ["all_images", "location"] });
        return { data: allData };
      } catch (error) {
        setIsLoading(false);
        setLoadingMessage(null);
        console.error("Error updating location:", error);
        const apiError = normalizeApiError(error);
        setError(apiError);
        return { error: apiError };
      } finally {
        setIsLoading(false);
        setLoadingMessage(null);
      }
    },
    [
      updateLocationMutation,
      uploadImageMutation,
      updateTranslationMutation,
      createTranslationMutation,
      queryClient,
    ],
  );
  return { mutateAsync, isLoading, loadingMessage, error, data };
};
