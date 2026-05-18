import type { EditLocationInput } from "@apptypes/location";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateLocation } from "@hooks/useLocations";
import { useUploadImage } from "@hooks/useImages";
import { useCreateTranslation } from "@hooks/useTranslations";
import { useCallback, useState } from "react";
import type { Location } from "@apptypes/location";
import type { UploadedImage } from "@apptypes/image";
import type { Translation } from "@apptypes/translation";
import { HTTPError, TimeoutError } from "ky";

interface DataTranslations {
  name_translation: {
    en: Translation | null;
    fi: Translation | null;
  };
  at_location_msg_translation: {
    en: Translation | null;
    fi: Translation | null;
  };
}
interface DataType {
  location: Location;
  image: UploadedImage | null;
  translations: DataTranslations;
}

// Creates a location, and uploads an image if provided and creates translations for the location name and at location message based on the location id.
export const useLocationCreator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [error, setError] = useState<HTTPError | TimeoutError | null>(null);
  const [data, setData] = useState<DataType | null>(null);
  const queryClient = useQueryClient();
  const createLocationMutation = useCreateLocation();
  const uploadImageMutation = useUploadImage();
  const createTranslationMutation = useCreateTranslation();

  const mutateAsync = useCallback(
    async (buildingId: number, locationData: EditLocationInput) => {
      setIsLoading(true);
      setError(null);
      setData(null);
      if (!buildingId) {
        return { error: "Building ID is required" };
      }
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
        let translationsResult: DataTranslations = {
          name_translation: {
            en: null,
            fi: null,
          },
          at_location_msg_translation: {
            en: null,
            fi: null,
          },
        };
        if (locationResult.location_id) {
          const nameKey = locationResult.trl_location_name_key;
          const atLocationMsgKey = locationResult.trl_current_location_msg_key;
          setLoadingMessage("Creating translations...");
          const [enName, fiName, enMsg, fiMsg] = await Promise.all([
            createTranslationMutation.mutateAsync({
              translation_key: nameKey,
              language_code: "en",
              type: "location_name",
              text_value: locationData.trl_location_name_en,
            }),
            createTranslationMutation.mutateAsync({
              translation_key: nameKey,
              language_code: "fi",
              type: "location_name",
              text_value: locationData.trl_location_name_fi,
            }),
            createTranslationMutation.mutateAsync({
              translation_key: atLocationMsgKey,
              language_code: "en",
              type: "at_location_message",
              text_value: locationData.trl_at_current_location_msg_en,
            }),
            createTranslationMutation.mutateAsync({
              translation_key: atLocationMsgKey,
              language_code: "fi",
              type: "at_location_message",
              text_value: locationData.trl_at_current_location_msg_fi,
            }),
          ]);
          translationsResult = {
            name_translation: {
              en: enName,
              fi: fiName,
            },
            at_location_msg_translation: {
              en: enMsg,
              fi: fiMsg,
            },
          };
        }

        queryClient.invalidateQueries({ queryKey: ["locations", buildingId] });
        const allData: DataType = {
          location: locationResult,
          image: imageResult,
          translations: translationsResult,
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
        if (error instanceof HTTPError || error instanceof TimeoutError) {
          setError(error);
        } else {
          setError(new Error("An unknown error occurred") as HTTPError);
        }
        return { error };
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
