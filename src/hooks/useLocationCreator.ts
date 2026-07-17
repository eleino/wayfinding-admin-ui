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
// import { useLanguages } from "./useAppInit";

interface DataTranslations {
  name_translation: {
    [lang: string]: Translation | null;
  };
  at_location_msg_translation: {
    [lang: string]: Translation | null;
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
  const [error, setError] = useState<HTTPError | TimeoutError | Error | null>(
    null,
  );
  const [data, setData] = useState<DataType | null>(null);
  const queryClient = useQueryClient();
  const createLocationMutation = useCreateLocation();
  const uploadImageMutation = useUploadImage();
  const createTranslationMutation = useCreateTranslation();
  // const languageCodes = useLanguages();

  const mutateAsync = useCallback(
    async (buildingId: number, locationData: EditLocationInput) => {
      setIsLoading(true);
      setError(null);
      setData(null);
      if (!buildingId) {
        return { error: "Building ID is required" };
      }
      // const languages = languageCodes.data?.map((lang) => lang.code) || [];
      // trim translations and convert to a map
      const toTranslationMap = (items: { lang: string; text?: string }[]) => {
        return items.reduce<Record<string, string>>((acc, item) => {
          const text = item.text?.trim();
          if (text) acc[item.lang] = text;
          return acc;
        }, {});
      };
      
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
        // let translationsResult: DataTranslations = {
        //   name_translation: {
        //     en: null,
        //     fi: null,
        //   },
        //   at_location_msg_translation: {
        //     en: null,
        //     fi: null,
        //   },
        // };
        const translationsResult: DataTranslations = {
          name_translation: {},
          at_location_msg_translation: {},
        };
        if (locationResult.location_id) {
          const nameKey = locationResult.trl_location_name_key;
          const atLocationMsgKey = locationResult.trl_current_location_msg_key;
          setLoadingMessage("Creating translations...");
          const translationMutations = [];
          const nameTranslations = toTranslationMap(locationData.trl_location_name);
          const msgTranslations = toTranslationMap(locationData.trl_at_current_location_msg);
          
          for (const [lang, text] of Object.entries(nameTranslations)) {
            translationMutations.push(
              createTranslationMutation.mutateAsync({
                translation_key: nameKey,
                language_code: lang,
                type: "location_name",
                text_value: text,
              }),
            );
          }
          for (const [lang, text] of Object.entries(msgTranslations)) {
            translationMutations.push(
              createTranslationMutation.mutateAsync({
                translation_key: atLocationMsgKey,
                language_code: lang,
                type: "at_location_message",
                text_value: text,
              }),
            );
          }
          const translationResults = await Promise.all(translationMutations);
          // for (const lang of languages) {
          //   // check if the translation exists in form input for the current language
          //   const nameTranslation = locationData.trl_location_name.find(
          //     (t) => t.lang === lang,
          //   );
          //   if (nameTranslation) {
          //     // if yes, add mutation for it
          //     translationMutations.push(
          //       createTranslationMutation.mutateAsync({
          //         translation_key: nameKey,
          //         language_code: lang,
          //         type: "location_name",
          //         text_value: nameTranslation.text,
          //       }),
          //     );
          //   }
          //   const atLocationMsgTranslation =
          //     locationData.trl_at_current_location_msg.find(
          //       (t) => t.lang === lang,
          //     );
          //   if (atLocationMsgTranslation) {
          //     translationMutations.push(
          //       createTranslationMutation.mutateAsync({
          //         translation_key: atLocationMsgKey,
          //         language_code: lang,
          //         type: "at_location_message",
          //         text_value: atLocationMsgTranslation.text,
          //       }),
          //     );
          // //   }
          //   const translationResults = await Promise.all(translationMutations);
            for (const result of translationResults) {
              if (result.type === "location_name") {
                translationsResult.name_translation[result.language_code] =
                  result;
              } else if (result.type === "at_location_message") {
                translationsResult.at_location_msg_translation[
                  result.language_code
                ] = result;
              }
            }
          // }
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
          setError(new Error("An unknown error occurred"));
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
