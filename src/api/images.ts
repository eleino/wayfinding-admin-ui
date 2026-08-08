import type { ImageResponse, UploadedImage } from "@apptypes/image";
import apiClient from "./client";
import { checkImageType } from "@utils/checkImageType";


// possible types: logo, location, step, site, building, overlay
export const fetchImagesByType = async (type: string): Promise<ImageResponse> => {
  if (!type || checkImageType(type) === false) {
    throw new Error("Type is required to fetch images and must be one of: location, site, step, building, overlay, logo.");
  }
  const response = await apiClient.get(`images/${type}`);
  return response.json();
}
// backend returns 10 images by default, can use query params limit and page for pagination
// backend result also includes "meta" which contains total number of images for that type, which can be used to calculate total pages for pagination


// fetch 20 images of the specified type, selected page
export const fetchImagesByTypeAndPage = async (type: string, page: number): Promise<ImageResponse> => {
  if (!type || checkImageType(type) === false) {
    throw new Error("Type is required to fetch images and must be one of: location, site, step, building, overlay, logo.");
  }
  const response = await apiClient.get(`images/${type}?limit=20&page=${page}`);
  return response.json();
}

// attempt to fetch all images of a type by setting limit to an arbitrary high number
// another possible way to implement this would be to look at the total number of images in the meta data and fetching that many images, but that would take at least 2 requests.
export const fetchAllImagesByType = async (type: string): Promise<ImageResponse> => {
  if (!type || checkImageType(type) === false) {
    throw new Error("Type is required to fetch images and must be one of: location, site, step, building, overlay, logo.");
  }
  const response = await apiClient.get(`images/${type}?limit=1000&page=1`);
  return response.json();
}

// posting+uploading image - can also be used to update image? on backend, deletes old image file and replaces with new one if key already exists
export const uploadImage = async (itemType: string, key: string, file: File, itemId: number|null): Promise<UploadedImage> => {
  if (!itemType || checkImageType(itemType) === false) {
    throw new Error("Type is required to upload image and must be one of: location, site, step, building, overlay, logo.");
  }
  if (!key || !file || !itemId) {
    throw new Error("Key, file and item ID are required to upload image.");
  }
  const formData = new FormData();
  formData.append('key', key);
  formData.append('type', itemType);
  if (itemType === "logo") formData.append('orgId', itemId?.toString() || '');
  else if (itemType === "site") formData.append('siteId', itemId?.toString() || '');
  else if (itemType === "building") formData.append('buildingId', itemId?.toString() || '');
  else if (itemType === "location" || itemType === "step") formData.append('locationId', itemId?.toString() || '');
 
  formData.append('file', file);

  const response = await apiClient.post(`images/upload`, { body: formData });
  return response.json();
}

export const copyImage = async (
  sourceKey: string,
  itemType: string,
  key: string,
  itemId: number | null,
): Promise<UploadedImage> => {
  if (!sourceKey || !itemType || !key || !itemId) {
    throw new Error(
      "Source key, type, destination key and item ID are required to copy an image.",
    );
  }

  const itemIdFields: Record<string, string> = {
    logo: "orgId",
    site: "siteId",
    building: "buildingId",
    location: "locationId",
    step: "locationId",
  };
  const itemIdField = itemIdFields[itemType];
  if (!itemIdField) throw new Error(`Images of type ${itemType} cannot be copied.`);

  const response = await apiClient.post("images/copy", {
    json: {
      sourceKey,
      key,
      type: itemType,
      [itemIdField]: itemId.toString(),
    },
  });
  return response.json();
};

// deleting image: DELETE /images/:key
export const deleteImage = async (key: string): Promise<void> => {
  await apiClient.delete(`images/${key}`);
}
