import type { BuildingType } from "@apptypes/building";
import apiClient from "./client";

export const fetchBuildings = async (siteId: number|null): Promise<BuildingType[]> => {
    if (!siteId) {
        throw new Error("Site ID is required to fetch buildings.");
    }
  const response = await apiClient.get(`sites/${siteId}/buildings`);
  const json: { data: BuildingType[] } = await response.json();
  return json.data;
}