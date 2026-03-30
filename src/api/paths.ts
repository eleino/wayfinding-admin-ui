import type { PathResponse } from "@apptypes/path";
import apiClient from "./client";


export const fetchPaths = async (building_id: number): Promise<PathResponse[]> => {
  const response = await apiClient.get(`buildings/${building_id}/paths`);
  return response.json();
}

export const fetchPathById = async (id: string): Promise<PathResponse> => {
  const response = await apiClient.get(`paths/${id}`);
  return response.json();
}
