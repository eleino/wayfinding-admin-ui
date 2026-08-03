import type { EditLocationInput } from "@apptypes/location";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateLocation } from "@hooks/useLocations";
import { useUploadImage } from "@hooks/useImages";
import { useCreateTranslation } from "@hooks/useTranslations";
import { useCallback, useState } from "react";
import type { Location } from "@apptypes/location";
import type { UploadedImage } from "@apptypes/image";
import type { Translation } from "@apptypes/translation";
import { ApiError, normalizeApiError } from "@api/errors";

interface DataType {
  location: Location;
  image: UploadedImage | null;
  translations: Translation[] | null;
}

// Creates a location, and uploads an image if provided and creates translations for the location name and at location message based on the location id.
export const useLocationCreator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [data, setData] = useState<DataType | null>(null);
  const queryClient = useQueryClient();
  const createLocationMutation = useCreateLocation();
  const uploadImageMutation = useUploadImage();
  const createTranslationMutation = useCreateTranslation();

  const mutateAsync = useCallback(
    async (buildingId: number, locationData: EditLocationInput) => {
      if (!buildingId) {
        return { error: "Building ID is required" };
      }
      setIsLoading(true);
      setError(null);
      setData(null);

      try {
        const location = {
          name: locationData.location_name,
          is_entry_location: locationData.is_entry_location,
          floor_number: locationData.floor_number,
        };
        setLoadingMessage("Creating location...");

        const locationResult = await createLocationMutation.mutateAsync({
          buildingId,
          location,
        });
        let imageResult: UploadedImage | null = null;

        if (locationData.imageFile && locationResult.location_id) {
          const key = locationResult.img_location_key;
          setLoadingMessage("Uploading image...");
          imageResult = await uploadImageMutation.mutateAsync({
            itemType: "location",
            key,
            file: locationData.imageFile,
            itemId: locationResult.location_id,
          });
        }

        let translationsResults: Translation[] = [];

        if (locationResult.location_id) {
          const nameKey = locationResult.trl_location_name_key;
          const atLocationMsgKey = locationResult.trl_current_location_msg_key;
          setLoadingMessage("Creating translations...");
          const translationMutations = [];

          // filter out empty translations
          const nameTranslations = locationData.trl_location_name.filter(
            (trl): trl is { lang: string; text: string } => !!trl.text,
          );
          const msgTranslations =
            locationData.trl_at_current_location_msg.filter(
              (trl): trl is { lang: string; text: string } => !!trl.text,
            );

          for (const { lang, text } of nameTranslations) {
            translationMutations.push(
              createTranslationMutation.mutateAsync({
                translation_key: nameKey,
                language_code: lang,
                type: "location_name",
                text_value: text,
              }),
            );
          }
          for (const { lang, text } of msgTranslations) {
            translationMutations.push(
              createTranslationMutation.mutateAsync({
                translation_key: atLocationMsgKey,
                language_code: lang,
                type: "at_location_message",
                text_value: text,
              }),
            );
          }
          translationsResults = await Promise.all(translationMutations);
        }

        queryClient.invalidateQueries({ queryKey: ["locations", buildingId] });
        const allData: DataType = {
          location: locationResult,
          image: imageResult,
          translations: translationsResults,
        };
        setData(allData);
        setIsLoading(false);
        setLoadingMessage(null);
        return {
          data: allData,
        };
      } catch (error) {
        setIsLoading(false);
        setLoadingMessage(null);
        console.error("Error creating location:", error);
        const apiError = normalizeApiError(error);
        setError(apiError);
        return { error: apiError };
      }
    },
    [
      createLocationMutation,
      uploadImageMutation,
      createTranslationMutation,
      queryClient,
    ],
  );
  return { mutateAsync, isLoading, loadingMessage, error, data };
};
