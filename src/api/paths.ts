import type { PathApiResponse, Path, CreatePathResponse } from "@apptypes/path";
import type { CreatePathDTO } from "@apptypes/dtos/create-path.dto";
import apiClient from "./client";
import type { UpdatePathDTO } from "@apptypes/dtos/update-path.dto";


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


export const createPath = async (building_id: number, pathData: CreatePathDTO): Promise<CreatePathResponse> => {
  const response = await apiClient.post(`buildings/${building_id}/paths`, { json: pathData });
  return response.json();
}

export const updatePath = async (path_id: number, pathData: UpdatePathDTO): Promise<CreatePathResponse> => {
  const response = await apiClient.put(`paths/${path_id}`, { json: pathData });
  return response.json();
}

export const deletePath = async (path_id: number): Promise<void> => {
  await apiClient.delete(`paths/${path_id}`);
}