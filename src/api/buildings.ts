import type { ListBuildingNamesAPI, ListBuilding } from "@apptypes/building";
import apiClient from "./client";

// There are two versions of the endpoint for fetching buildings
// this one is /sites/:id/buildings and returns a list of buildings with just name and id
// TODO: implement pagination if the number of buildings can grow larger, returns 10 by default
// pagination data is under the meta object in the response
export const fetchBuildings = async (siteId: number|null): Promise<ListBuilding[]> => {
    if (!siteId) {
        throw new Error("Site ID is required to fetch buildings.");
    }
  const response = await apiClient.get(`sites/${siteId}/buildings`);
  const json: { data: ListBuilding[] } = await response.json();
  return json.data;
}

// this one is /sites/:id/buildings/names and also returns image url and translations
// TODO: implement pagination if the number of buildings can grow larger, returns 10 by default
export const fetchBuildingNames = async (siteId: number|null, lang = "fi"): Promise<ListBuildingNamesAPI[]> => {
    if (!siteId) {
        throw new Error("Site ID is required to fetch building names.");
    }
    const response = await apiClient.get(`sites/${siteId}/buildings/names?lang=${lang}`);
    const json: { data: ListBuildingNamesAPI[] } = await response.json();
    return json.data;
}