import { useQuery } from "@tanstack/react-query";
import { fetchBuildings } from "@api/buildings";

export const useGetBuildings = (siteId: number|null, options = {}) => {
        const query = useQuery({ queryKey: ["buildings", siteId], queryFn: () => fetchBuildings(siteId), enabled: !!siteId, ...options });
        return query;
}