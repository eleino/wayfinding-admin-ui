import { fetchStepById, fetchPathInstructions, updateSteps } from "@api/steps";
import type { UpdateStepDTO } from "@apptypes/dtos/update-step.dto";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetStepById = (id: number | null, lang?: string, options = {}) => {
  if (!id) {
    throw new Error("Step ID is required to fetch a specific step.");
  }
  const query = useQuery({ queryKey: ["step", id], queryFn: () => fetchStepById(id, lang), ...options });
  return query;
}

export const useGetPathInstructions = (id: number | null, lang: string = "fi", fromLocation?: number, options = {}) => {
  if (!id) {
    throw new Error("Path ID is required to fetch path instructions.");
  }
  const query = useQuery({ queryKey: ["pathInstructions", id, lang], queryFn: () => fetchPathInstructions(id, lang, fromLocation), ...options });
  return query;
}

export const useUpdateSteps = (options = {}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ pathId, stepsData }: { pathId: number, stepsData: UpdateStepDTO[] }) => updateSteps(pathId, stepsData),
    onSuccess: (data) => {
      const pathId = data.length > 0 ? data[0].path_id : null;
      if (pathId) {
        queryClient.invalidateQueries({ queryKey: ["path", pathId] });
        queryClient.invalidateQueries({ queryKey: ["pathInstructions", pathId, "fi"] });
        queryClient.invalidateQueries({ queryKey: ["pathInstructions", pathId, "en"] });
      }
    },
    ...options
  });
  return mutation;
}