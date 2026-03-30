import apiClient from "./client";
import type { Site } from "@apptypes/site";

export const fetchSites = async (orgId: number | null): Promise<Site[]> => {
    if (!orgId) {
        throw new Error("Organization ID is required to fetch sites.");
    }
  const response = await apiClient.get(`organizations/${orgId}/sites`);
  return response.json();
};
