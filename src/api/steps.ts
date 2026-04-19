import type { StepApiResponse } from "@apptypes/step";
import apiClient from "./client";


// Note: the list of steps is fetched as part of path details, in paths.ts
// here we only fetch the details of a single step
export const fetchStepById = async (id: number): Promise<StepApiResponse> => {
  const response = await apiClient.get(`steps/${id}/overview`);
  return response.json();
}