import apiClient from "./client";
import type { OrganisationType } from "@apptypes/OrganisationType";

export const fetchOrganisations = async (): Promise<OrganisationType[]> => {
  const response = await apiClient.get('organizations');
  return response.json();
}
