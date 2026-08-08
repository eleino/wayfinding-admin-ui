import { useMemo } from "react";
import { useGetAllImagesByType } from "./useImages";
import { groupImagesByLocation } from "@utils/groupImagesByLocation";

/**
 * Custom hook to fetch and group images by location, including location and step images.
 * @param locationId - The ID of the location to filter images by.
 * @returns An object containing grouped images, loading state, and any error encountered.
 */
export const useLocationImageLibrary = (locationId?: number) => {
  const locationImages = useGetAllImagesByType("location");
  const stepImages = useGetAllImagesByType("step");

  const groups = useMemo(
    () =>
      groupImagesByLocation(
        [
          ...(locationImages.data?.data || [])
            .filter((image) => Boolean(image.url))
            .map((image) => ({ ...image, type: "location" })),
          ...(stepImages.data?.data || [])
            .filter((image) => Boolean(image.url))
            .map((image) => ({ ...image, type: "step" })),
        ],
        locationId,
      ),
    [locationId, locationImages.data, stepImages.data],
  );

  return {
    groups,
    isLoading: locationImages.isLoading || stepImages.isLoading,
    error: locationImages.error || stepImages.error,
  };
};
