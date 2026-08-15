import type { UpdateOrganisationDTO } from "@apptypes/dtos/update-organisation.dto";
import apiClient from "./client";
import type {
  ChildOrgCreationResponse,
  OrganisationOverview,
  OrganisationType,
} from "@apptypes/organisation";

export interface CreateOrganisationDTO {
  name: string;
}

export const fetchOrganisations = async (): Promise<OrganisationType[]> => {
  const response = await apiClient.get('organizations');
  return response.json();
}

export const updateOrganisation = async (
  { id, organisation }: { id: number; organisation: UpdateOrganisationDTO },
): Promise<OrganisationOverview["organization"]> => {
  const response = await apiClient.put(`organizations/${id}`, {
    json: organisation,
  });
  return response.json();
};

export const createOrganisation = async (
  parentId: number,
  organisation: CreateOrganisationDTO,
): Promise<ChildOrgCreationResponse> => {
  const response = await apiClient.post(`organizations/${parentId}/children`, {
    json: organisation,
  });
  return response.json();
};

export const deleteOrganisation = async (id: number): Promise<void> => {
  await apiClient.delete(`organizations/${id}`);
};

export const updateOrganisationSettings = async (
  id: number,
  themeJson: string,
): Promise<OrganisationOverview["settings"]> => {
  const response = await apiClient.put(`organizations/${id}/settings`, {
    json: { theme_json: themeJson },
  });
  return response.json();
};

export const fetchOrganisationById = async (id: number|null): Promise<OrganisationOverview> => {
  if (!id) {
    throw new Error("Organization ID is required to fetch organization details.");
  }
  const response = await apiClient.get(`organizations/${id}/overview`);
  return response.json();
}
