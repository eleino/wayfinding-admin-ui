import type { ExistingImageGroup, SelectableImage } from "@apptypes/image";

/**
 * Determines the relevance of an image based on its key and the provided location ID.
 * @param key - The key of the image.
 * @param locationId - The ID of the location to compare against.
 * @returns A number indicating the relevance: 0 for at location, 1 for connected, 2 for other.
 */
const getLocationRelevance = (key: string, locationId: number) => {
  const locationMatch = key.match(/^LOCATION_(\d+)_IMG$/);
  if (locationMatch) {
    return Number(locationMatch[1]) === locationId ? 0 : 2;
  }

  const approachMatch = key.match(/^IMAGE_APPROACH_(\d+)_FROM_(\d+)$/);
  if (approachMatch) {
    if (Number(approachMatch[1]) === locationId) return 0;
    if (Number(approachMatch[2]) === locationId) return 1;
  }

  const nextMatch = key.match(/^IMAGE_NEXT_(\d+)_TO_(\d+|DESTINATION)$/);
  if (nextMatch) {
    if (Number(nextMatch[1]) === locationId) return 0;
    if (nextMatch[2] !== "DESTINATION" && Number(nextMatch[2]) === locationId) {
      return 1;
    }
  }

  return 2;
};

/**
 * Groups images by their relevance to a specific location.
 * @param images - An array of SelectableImage objects to be grouped.
 * @param locationId - The ID of the location to group images by.
 * @returns An array of ExistingImageGroup objects, each containing a label and an array of images.
 */
export const groupImagesByLocation = (
  images: SelectableImage[],
  locationId?: number,
): ExistingImageGroup[] => {
  const sortedImages = [...images].sort((a, b) => a.key.localeCompare(b.key));
  if (!locationId) return [{ label: "All images", images: sortedImages }];

  const groups: ExistingImageGroup[] = [
    { label: `At location ${locationId}`, images: [] },
    { label: `Connected to location ${locationId}`, images: [] },
    { label: "Other images", images: [] },
  ];

  for (const image of sortedImages) {
    groups[getLocationRelevance(image.key, locationId)].images.push(image);
  }

  return groups.filter((group) => group.images.length > 0);
};
