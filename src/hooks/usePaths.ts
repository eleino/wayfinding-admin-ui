import { fetchPaths, fetchPathById } from "@api/paths";
import { useQuery } from "@tanstack/react-query";

export const useGetPaths = (buildingId: number | null, options = {}) => {
    if (!buildingId) {
        throw new Error("Building ID is required to fetch paths.");
    }
  const query = useQuery({ queryKey: ["paths", buildingId], queryFn: () => fetchPaths(buildingId), enabled: !!buildingId, ...options });
  return query;
}

export const useGetPathById = (id: number | null, options = {}) => {
  if (!id) {
    throw new Error("Path ID is required to fetch a specific path.");
  }
  const query = useQuery({ queryKey: ["paths", id], queryFn: () => fetchPathById(id), ...options });
  return query;
}