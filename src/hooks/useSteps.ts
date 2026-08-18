import { fetchStepById, fetchPathInstructions, updateSteps } from "@api/steps";
import type { UpdateStepDTO } from "@apptypes/dtos/update-step.dto";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLanguages } from "./useAppInit";
import type { StepInstructionsList } from "@apptypes/step";
import { useState } from "react";

export const useGetStepById = (id: number | null, lang?: string, options = {}) => {
  if (!id) {
    throw new Error("Step ID is required to fetch a specific step.");
  }
  const query = useQuery({ queryKey: ["step", id], queryFn: () => fetchStepById(id, lang), ...options });
  return query;
}

export const useGetPathInstructions = (id: number | null, lang: string = "fi", fromLocation?: number, options = {}) => {
  const query = useQuery({ queryKey: ["pathInstructions", id, lang, fromLocation], queryFn: () => fetchPathInstructions(id, lang, fromLocation), ...options, enabled: !!id });
  return query;
}

export const useGetPathInstructionsAllLangs = (
  id: number | null,
  fromLocation?: number,
  options: { enabled?: boolean } = {},
) => {
  const languageList = useLanguages();

  const query = useQuery({ queryKey: ["pathInstructionsAllLangs", id, fromLocation], queryFn: async () => {
    if (!languageList.data) return [];
    const promises: Promise<StepInstructionsList>[] = [];
    languageList.data?.forEach((lang) => {
      promises.push(fetchPathInstructions(id, lang.code, fromLocation));
    });
    return Promise.all(promises);
  }, ...options, enabled: !!id && !!languageList.data && options.enabled !== false });
  return query;
}

export const useUpdateSteps = (options = {}) => {
  const queryClient = useQueryClient();
  const languageList = useLanguages();
  const [error, setError] = useState<Error | null>(null);
  const mutation = useMutation({
    mutationFn: ({ pathId, stepsData }: { pathId: number, stepsData: UpdateStepDTO[] }) => updateSteps(pathId, stepsData),
    onSuccess: async (data) => {
      const pathId = data.length > 0 ? data[0].path_id : null;
      if (pathId) {
        await queryClient.invalidateQueries({ queryKey: ["path", pathId] });
        if (languageList.data) {
          languageList.data.forEach((lang) => {
            queryClient.invalidateQueries({ queryKey: ["pathInstructions", pathId, lang.code] });
          });
        }
      }
    },
    onError: (err: unknown) => {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error("An unknown error occurred while updating steps."));
      }
    },
    ...options
  });
  return { ...mutation, error };
}
