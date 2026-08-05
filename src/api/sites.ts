import apiClient from "./client";
import type { Site, SiteOverview } from "@apptypes/site";
import type { UpdateSiteDTO } from "@apptypes/dtos/update-site.dto";

export const fetchSites = async (orgId: number | null): Promise<Site[]> => {
    if (!orgId) {
        throw new Error("Organization ID is required to fetch sites.");
    }
  const response = await apiClient.get(`organizations/${orgId}/sites`);
  return response.json();
};

export const fetchSiteById = async (id: number): Promise<SiteOverview> => {
  const response = await apiClient.get(`sites/${id}/overview`);
  return response.json();
};

export const updateSite = async (
  { id, site }: { id: number; site: UpdateSiteDTO },
): Promise<SiteOverview["site"]> => {
  const response = await apiClient.put(`sites/${id}`, { json: site });
  return response.json();
};
