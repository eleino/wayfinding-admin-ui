import { fetchPaths, fetchPathById, createPath, updatePath, deletePath } from "@api/paths";
import type { CreatePathDTO } from "@apptypes/dtos/create-path.dto";
import type { UpdatePathDTO } from "@apptypes/dtos/update-path.dto";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetPaths = (buildingId: number | undefined, options = {}) => {
    if (!buildingId) {
        throw new Error("Building ID is required to fetch paths.");
    }
  const query = useQuery({ queryKey: ["paths", buildingId], queryFn: () => fetchPaths(buildingId), enabled: !!buildingId, ...options });
  return query;
}

export const useGetPathById = (id: number | undefined, options = {}) => {
  if (!id) {
    throw new Error("Path ID is required to fetch a specific path.");
  }
  const query = useQuery({ queryKey: ["path", id], queryFn: () => fetchPathById(id), ...options });
  return query;
}

export const useCreatePath = (options = {}) => {
  const mutation = useMutation({
    mutationFn: ({buildingId, pathData}: { buildingId: number, pathData: CreatePathDTO }) => createPath(buildingId, pathData),
    ...options  
  });
  return mutation;
};

export const useUpdatePath = (options = {}) => {
  const mutation = useMutation({
    mutationFn: ({ pathId, pathData }: { pathId: number, pathData: UpdatePathDTO }) => updatePath(pathId, pathData),
    ...options
  });
  return mutation;
}

export const useDeletePath = (options = {}) => {
  const mutation = useMutation({
    mutationFn: (pathId: number | undefined) => deletePath(pathId),
    ...options
  });
  return mutation;
}