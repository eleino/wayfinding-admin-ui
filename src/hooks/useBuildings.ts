import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBuilding,
  fetchBuildingById,
  fetchBuildings,
  updateBuilding,
} from "@api/buildings";
import { useEffect } from "react";
import { useSelectionStore } from "@storage/store";

export const useGetBuildings = (siteId: number | null, options = {}) => {
  const query = useQuery({
    queryKey: ["buildings", siteId],
    queryFn: () => fetchBuildings(siteId),
    enabled: !!siteId,
    ...options,
  });
  useEffect(() => {
    if (query.data) {
      useSelectionStore.setState({
        buildingList: query.data.map((building) => ({
          id: Number(building.id),
          name: building.name,
        })),
      });
    }
  }, [query.data]);
  return query;
};

export const useGetBuildingById = (id: number | null, options = {}) =>
  useQuery({
    queryKey: ["buildings", "detail", id],
    queryFn: () => fetchBuildingById(id!),
    enabled: !!id,
    ...options,
  });

export const useUpdateBuilding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBuilding,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
      queryClient.invalidateQueries({ queryKey: ["buildings", "detail", variables.id] });
    },
  });
};

export const useCreateBuilding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      siteId,
      building,
    }: {
      siteId: number;
      building: { name: string; total_floors: number; organizations: number[] };
    }) => createBuilding(siteId, building),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
      queryClient.invalidateQueries({
        queryKey: ["sites", "detail", variables.siteId],
      });
    },
  });
};
