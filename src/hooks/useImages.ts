import { useQuery, useMutation, useInfiniteQuery } from "@tanstack/react-query";
import {
  fetchAllImagesByType,
  fetchImagesByType,
  fetchImagesByTypeAndPage,
  uploadImage,
  deleteImage,
  copyImage,
} from "@api/images";

const IMAGE_LIST_STALE_TIME = 5 * 60 * 1000; // controls how often the image list may be refetched due to stale data
const IMAGE_LIST_GC_TIME = 30 * 60 * 1000; // controls how long the image list is kept cached

type UploadImageParams = {
  itemType: string;
  key: string;
  file: File;
  itemId?: number|null;
};

type CopyImageParams = Omit<UploadImageParams, "file"> & {
  sourceKey: string;
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
    staleTime: IMAGE_LIST_STALE_TIME,
    gcTime: IMAGE_LIST_GC_TIME,
    ...options,
  });
  return query;
};

export const useGetImagesByTypeInfinite = (
  type: string,
  options = {},
) => {
  return useInfiniteQuery({
    queryKey: ["imagesInfinite", type],
    queryFn: ({pageParam = 1}) => fetchImagesByTypeAndPage(type, pageParam),
    enabled: !!type,
    staleTime: IMAGE_LIST_STALE_TIME,
    gcTime: IMAGE_LIST_GC_TIME,
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
      uploadImage(itemType, key, file, itemId || null),
    ...options,
  });
  return mutation;
};

export const useCopyImage = (options = {}) =>
  useMutation({
    mutationFn: ({ sourceKey, itemType, key, itemId }: CopyImageParams) =>
      copyImage(sourceKey, itemType, key, itemId || null),
    ...options,
  });

export const useDeleteImage = (options = {}) =>
  useMutation({
    mutationFn: (key: string) => deleteImage(key),
    ...options,
  });
