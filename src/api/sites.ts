import apiClient from "./client";
import type { Site, SiteCreationResponse, SiteOverview } from "@apptypes/site";
import type { UpdateSiteDTO } from "@apptypes/dtos/update-site.dto";

export interface CreateSiteDTO {
  name: string;
  address: string;
}

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

export const createSite = async (
  organisationId: number,
  site: CreateSiteDTO,
): Promise<SiteCreationResponse> => {
  const response = await apiClient.post(`organizations/${organisationId}/sites`, {
    json: site,
  });
  return response.json();
};

export const deleteSite = async (id: number): Promise<void> => {
  await apiClient.delete(`sites/${id}`);
};
