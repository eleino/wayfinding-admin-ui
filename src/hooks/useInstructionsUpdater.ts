// used for creating/updating a step's instructions, including english and finnish translations for on_approach and to_next instructions, adding/updating an image, and updating overlays for both directions
import { useQueryClient } from "@tanstack/react-query";
import {
  useCreateTranslation,
  useDeleteTranslation,
  useUpdateTranslation,
} from "@hooks/useTranslations";
import {
  useCopyImage,
  useDeleteImage,
  useUploadImage,
} from "@hooks/useImages";
import {
  useUpdateOverlay,
  useCreateOverlay,
  useDeleteOverlay,
} from "@hooks/useOverlays";
import { useCallback, useState } from "react";
import type { UploadedImage } from "@apptypes/image";
import type { Translation } from "@apptypes/translation";
import type { OverlayResponse } from "@apptypes/overlay";
import type { StepApiResponse } from "@apptypes/step";
import type { EditStepInput } from "@schemas/step.schema";
import { useLanguages } from "./useAppInit";
import { ApiError, normalizeApiError } from "@api/errors";

interface DataType {
  translations: Translation[] | null;
  uploadedImages: UploadedImage[] | null;
  overlays: OverlayResponse[] | null;
}
export const useInstructionsUpdater = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [data, setData] = useState<DataType | null>(null);

  const queryClient = useQueryClient();
  const createTranslationMutation = useCreateTranslation();
  const updateTranslationMutation = useUpdateTranslation();
  const deleteTranslationMutation = useDeleteTranslation();
  const uploadImageMutation = useUploadImage();
  const copyImageMutation = useCopyImage();
  const deleteImageMutation = useDeleteImage();
  const updateOverlayMutation = useUpdateOverlay();
  const createOverlayMutation = useCreateOverlay();
  const deleteOverlayMutation = useDeleteOverlay();
  const languageList = useLanguages();

  const mutateAsync = useCallback(
    async (
      updatedInstructionData: EditStepInput,
      initialData: EditStepInput,
      stepData: StepApiResponse,
    ) => {
      setIsLoading(true);
      setLoadingMessage("Updating instructions...");
      setError(null);
      setData(null);
      const directions = ["on_approach", "to_next"] as const;
      const languages = languageList.data?.map((lang) => lang.code) || [];
      const translationTypeMap = {
        on_approach: "approach_instruction",
        to_next: "to_next_instruction",
      };
      try {
        const translationTasks = [];
        const imageTasks = [];
        const imageDeletionTasks = [];
        const overlayTasks = [];

        for (const dir of directions) {
          // find correct instruction for the direction
          const instruction = stepData.step.instructions.find(
            (instr) => instr.direction === dir,
          );
          if (!instruction) {
            continue;
          }
          // set keys
          const trl_instruction_key = instruction.trl_instruction_key;
          const img_key = instruction.img_key;
          const overlay_key = instruction.overlay_key;

          // handle translations
          for (const lang of languages) {
            const newTextValue =
              updatedInstructionData[`trl_instruction_${dir}`]?.find((trl) => trl.lang === lang)?.text || "";
            const initialTextValue =
              initialData[`trl_instruction_${dir}`]?.find((trl) => trl.lang === lang)?.text || "";

            if (newTextValue !== initialTextValue) {
              if (initialTextValue && !newTextValue) {
                // translation removed, delete translation
                translationTasks.push(
                  deleteTranslationMutation.mutateAsync({
                    translationKey: trl_instruction_key,
                    lang,
                  }),
                );
              } else if (!initialTextValue && newTextValue) {
                // added, create translation
                translationTasks.push(
                  createTranslationMutation.mutateAsync({
                    translation_key: trl_instruction_key,
                    type: translationTypeMap[dir],
                    text_value: newTextValue,
                    language_code: lang,
                  }),
                );
              } else if (initialTextValue && newTextValue) {
                // changed, update translation
                translationTasks.push(
                  updateTranslationMutation.mutateAsync({
                    translationKey: trl_instruction_key,
                    lang,
                    translation: { text_value: newTextValue },
                  }),
                );
              }
            }
          }
          // handle images
          const newImageFile = updatedInstructionData[`image_${dir}_file`];
          const existingImageKey =
            updatedInstructionData[`existing_image_${dir}_key`];
          const imageType = img_key.startsWith("LOCATION_") //first approach image is start location image if present
            ? "location"
            : "step";
          if (newImageFile) {
            imageTasks.push(
              uploadImageMutation.mutateAsync({
                itemType: imageType,
                key: img_key,
                itemId: stepData.step.location_id,
                file: newImageFile,
              }),
            );
          } else if (existingImageKey) {
            imageTasks.push(
              copyImageMutation.mutateAsync({
                sourceKey: existingImageKey,
                itemType: imageType,
                key: img_key,
                itemId: stepData.step.location_id,
              }),
            );
          } else if (updatedInstructionData[`remove_image_${dir}`]) {
            imageDeletionTasks.push(deleteImageMutation.mutateAsync(img_key));
          }

          // handle overlays
          const newOverlayData = updatedInstructionData[`overlay_${dir}`];
          console.log("New overlay data for direction", dir, ":", newOverlayData);
          const initialOverlayData = initialData[`overlay_${dir}`];
          console.log("Initial overlay data for direction", dir, ":", initialOverlayData);
          if (newOverlayData && !initialOverlayData) {
            console.log("Creating new overlay for direction", dir);
            // create new overlay
            overlayTasks.push(
              createOverlayMutation.mutateAsync({
                ...newOverlayData,
                overlay_key,
              }),
            );
          } else if (initialOverlayData && !newOverlayData?.image_key) {
            // delete existing overlay
            overlayTasks.push(deleteOverlayMutation.mutateAsync(overlay_key));
          } else if (newOverlayData && initialOverlayData) {
            // update existing overlay if data has changed
            if (
              newOverlayData.image_key !==
                initialOverlayData.image_key ||
              newOverlayData.position_x_percent !==
                initialOverlayData.position_x_percent ||
              newOverlayData.position_y_percent !==
                initialOverlayData.position_y_percent ||
              newOverlayData.overlay_size !== initialOverlayData.overlay_size ||
              newOverlayData.rotation_deg !== initialOverlayData.rotation_deg ||
              newOverlayData.rotation_x_deg !==
                initialOverlayData.rotation_x_deg
            ) {
              // we can just send all fields since none of them have side effects
              overlayTasks.push(
                updateOverlayMutation.mutateAsync({
                  overlayKey: overlay_key,
                  dto: newOverlayData,
                }),
              );
            }
          }
        }
        setLoadingMessage("Updating translations...");
        const translationsResult = await Promise.allSettled(translationTasks);
        setLoadingMessage("Updating images...");
        const imageDeletionResults = await Promise.allSettled(
          imageDeletionTasks,
        );
        const uploadedImagesResult = await Promise.allSettled(imageTasks);
        const failedImageOperation = [
          ...imageDeletionResults,
          ...uploadedImagesResult,
        ].find((result) => result.status === "rejected");
        if (failedImageOperation?.status === "rejected") {
          throw failedImageOperation.reason;
        }
        setLoadingMessage("Updating overlays...");
        const overlaysResult = await Promise.allSettled(overlayTasks);

        setLoadingMessage("Finished updating instructions.");

        // filter results to only fulfilled, and extract values
        const filteredData = {
          translations: translationsResult
            .filter(
              (res): res is PromiseFulfilledResult<Translation> =>
                res.status === "fulfilled",
            )
            .map((res) => res.value),
          uploadedImages: uploadedImagesResult
            .filter(
              (res): res is PromiseFulfilledResult<UploadedImage> =>
                res.status === "fulfilled",
            )
            .map((res) => res.value),
          overlays: overlaysResult
            .filter(
              (res): res is PromiseFulfilledResult<OverlayResponse> =>
                res.status === "fulfilled",
            )
            .map((res) => res.value),
        };
        setData(filteredData);
        setIsLoading(false);
        queryClient.invalidateQueries({
          queryKey: ["step", stepData.step.path_step_id],
        });
        queryClient.invalidateQueries({ queryKey: ["all_images", "location"] });
        queryClient.invalidateQueries({ queryKey: ["all_images", "step"] });
        queryClient.invalidateQueries({
          queryKey: ["steps", stepData.step.path_id],
        });
        queryClient.invalidateQueries({
          queryKey: ["location", stepData.step.location_id],
        });
        stepData.step.instructions.forEach((instruction) => {
          queryClient.invalidateQueries({
            queryKey: [
              "translationsAllLangs",
              instruction.trl_instruction_key,
            ],
          });
        });
        for (const lang of languages) {
          queryClient.invalidateQueries({
            queryKey: ["pathInstructions", stepData.step.path_id, lang],
          });
        }
        queryClient.invalidateQueries({
          queryKey: ["pathInstructionsAllLangs", stepData.step.path_id],
        });
        return {
          data: filteredData,
        };
      } catch (error) {
        const apiError = normalizeApiError(error);
        setError(apiError);
        setIsLoading(false);
        setLoadingMessage(null);
        return { error: apiError };
      }
    },
    [
      queryClient,
      createTranslationMutation,
      updateTranslationMutation,
      deleteTranslationMutation,
      uploadImageMutation,
      copyImageMutation,
      deleteImageMutation,
      updateOverlayMutation,
      createOverlayMutation,
      deleteOverlayMutation,
      languageList,
    ],
  );

  return { mutateAsync, isLoading, loadingMessage, error, data };
};
