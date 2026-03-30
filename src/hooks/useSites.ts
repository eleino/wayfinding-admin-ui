import { useQuery } from "@tanstack/react-query";
import { fetchSites } from "@api/sites";

export const useGetSites = (orgId: number|null, options = {}) => {
        const query = useQuery({ queryKey: ["sites", orgId], queryFn: () => fetchSites(orgId), enabled: !!orgId, ...options });
        return query;
}