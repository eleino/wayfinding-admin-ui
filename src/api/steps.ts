import type { StepApiResponse, StepInstructionsList } from "@apptypes/step";
import apiClient from "./client";
import type { UpdateStepDTO } from "@apptypes/dtos/update-step.dto";


// Note: the list of steps is fetched as part of path details, in paths.ts
// here we only fetch the details of a single step
export const fetchStepById = async (id: number, lang = "fi"): Promise<StepApiResponse> => {
  const response = await apiClient.get(`steps/${id}/overview?lang=${lang}`);
  return response.json();
}

export const fetchPathInstructions = async (id: number, lang: string, fromLocation?: number): Promise<StepInstructionsList> => {
  const response = await apiClient.get(`paths/${id}/instructions?lang=${lang}${fromLocation ? `&fromLocation=${fromLocation}` : ''}`);
  return response.json();
}

export const updateSteps = async (pathId: number, stepsData: UpdateStepDTO[]): Promise<void> => {
  await apiClient.put(`paths/${pathId}/steps`, { json: stepsData });
}