import { useQuery, useMutation, useInfiniteQuery } from "@tanstack/react-query";
import {
  fetchAllImagesByType,
  fetchImagesByType,
  fetchImagesByTypeAndPage,
  uploadImage,
} from "@api/images";

type UploadImageParams = {
  itemType: string;
  key: string;
  file: File;
  itemId: number;
};

export const useGetImagesByType = (type: string, options = {}) => {
  const query = useQuery({
    queryKey: ["images", type],
    queryFn: () => fetchImagesByType(type),
    enabled: !!type,
    ...options,
  });
  return query;
};

export const useGetAllImagesByType = (type: string, options = {}) => {
  const query = useQuery({
    queryKey: ["all_images", type],
    queryFn: () => fetchAllImagesByType(type),
    ...options,
  });
  return query;
};

export const useGetImagesByTypeInfinite = (
  type: string,
  options = {},
) => {
  return useInfiniteQuery({
    queryKey: ["images", type],
    queryFn: ({pageParam = 1}) => fetchImagesByTypeAndPage(type, pageParam),
    enabled: !!type,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.flatMap((page) => page.data).length;
      const total = lastPage.meta.images.total;
      return loaded < total ? allPages.length + 1 : undefined;
    },
    ...options,
  });
};

export const useUploadImage = (options = {}) => {
  // itemType can be one of: location, site, step, building, overlay, logo
  // key is the unique key for the image, for location images it will be LOCATION_(locationId)_IMG
  // itemId is the id of the item the image is associated with, for location images it will be the locationId
  const mutation = useMutation({
    mutationFn: ({ itemType, key, file, itemId }: UploadImageParams) =>
      uploadImage(itemType, key, file, itemId),
    ...options,
  });
  return mutation;
};
