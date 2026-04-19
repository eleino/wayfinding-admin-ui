import { useQuery } from "@tanstack/react-query";
import { fetchBuildings } from "@api/buildings";
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
