import { fetchPaths, fetchPathById, createPath, updatePath, deletePath } from "@api/paths";
import type { CreatePathDTO } from "@apptypes/dtos/create-path.dto";
import type { UpdatePathDTO } from "@apptypes/dtos/update-path.dto";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSelectionStore } from "@storage/store";

export const useGetPaths = (buildingId: number | undefined, options = {}) => {
  const query = useQuery({
    queryKey: ["paths", buildingId],
    queryFn: () => fetchPaths(buildingId!),
    enabled: !!buildingId,
    ...options,
  });
  // Update the pathList in the selection store whenever the query data changes
  useEffect(() => {
    if (query.data) {
      useSelectionStore.setState({ pathList: query.data });
    }
  }, [query.data]);

  return query;
}

export const useGetPathById = (id: number | undefined, options = {}) => {
  const query = useQuery({ queryKey: ["path", id], queryFn: () => fetchPathById(id), ...options, enabled: !!id });
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
