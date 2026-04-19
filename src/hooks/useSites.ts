import { useQuery } from "@tanstack/react-query";
import { fetchSites } from "@api/sites";
// import { useEffect } from "react";
// import { useSelectionStore } from "@storage/store";

export const useGetSites = (orgId: number | null, options = {}) => {
  const query = useQuery({
    queryKey: ["sites", orgId],
    queryFn: () => fetchSites(orgId),
    enabled: !!orgId,
    ...options,
  });
/*   useEffect(() => {
    if (query.data) {
      useSelectionStore.setState({
        siteList: query.data.map((site) => ({
          id: Number(site.id),
          name: site.name,
        })),
      });
    }
  }, [query.data]); */
  return query;
};
