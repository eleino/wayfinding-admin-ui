import apiClient from "./client";
import type { OrganisationType } from "@apptypes/organisation";

export const fetchOrganisations = async (): Promise<OrganisationType[]> => {
  const response = await apiClient.get('organizations');
  return response.json();
}

export const fetchOrganisationById = async (id: number): Promise<OrganisationType> => {
  const response = await apiClient.get(`organizations/${id}`);
  return response.json();
}