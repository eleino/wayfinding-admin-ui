import type { PathApiResponse, Path } from "@apptypes/path";
import apiClient from "./client";


// TODO: implement pagination
export const fetchPaths = async (building_id: number): Promise<Path[]> => {
  const response = await apiClient.get(`buildings/${building_id}/paths?page=1&limit=1000`);
  const json: { data: Path[] } = await response.json();
  return json.data;
}

export const fetchPathById = async (id: number): Promise<PathApiResponse> => {
  const response = await apiClient.get(`paths/${id}/overview`);
  return response.json();
}
