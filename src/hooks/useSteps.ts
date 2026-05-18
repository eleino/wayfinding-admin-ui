import { fetchStepById, fetchPathInstructions, updateSteps } from "@api/steps";
import type { UpdateStepDTO } from "@apptypes/dtos/update-step.dto";
import { useMutation, useQuery } from "@tanstack/react-query";

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
  const mutation = useMutation({
    mutationFn: ({ pathId, stepsData }: { pathId: number, stepsData: UpdateStepDTO[] }) => updateSteps(pathId, stepsData),
    ...options
  });
  return mutation;
}