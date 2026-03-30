import apiClient from "./client";


// possible types: logo, location, step, site, building, overlay
export const fetchImagesByType = async (type: string): Promise<string[]> => {
  const response = await apiClient.get(`images/${type}`);
  return response.json();
}

// posting+uploading image - can also be used to update image? on backend, deletes old image file and replaces with new one if key already exists
export const uploadImage = async (type: string, key: string, file: File, orgId?: number, siteId?: number, buildingId?: number, locationId?: number): Promise<void> => {
  const formData = new FormData();
  formData.append('key', key);
  formData.append('type', type);
  if (type === "logo" && orgId) formData.append('org_id', orgId.toString());
  else if (type === "site" && siteId) formData.append('site_id', siteId.toString());
  else if (type === "building" && buildingId) formData.append('building_id', buildingId.toString());
  else if (type === "location" && locationId) formData.append('location_id', locationId.toString());
  formData.append('file', file);

  await apiClient.post(`images/upload`, { body: formData });
}

// deleting image: DELETE /images/:key
export const deleteImage = async (key: string): Promise<void> => {
  await apiClient.delete(`images/${key}`);
}