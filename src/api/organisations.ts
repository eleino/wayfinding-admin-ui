import type { UpdateOrganisationDTO } from "@apptypes/dtos/update-organisation.dto";
import apiClient from "./client";
import type { OrganisationOverview, OrganisationType } from "@apptypes/organisation";

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

export const fetchOrganisationById = async (id: number|null): Promise<OrganisationOverview> => {
  if (!id) {
    throw new Error("Organization ID is required to fetch organization details.");
  }
  const response = await apiClient.get(`organizations/${id}/overview`);
  return response.json();
}
