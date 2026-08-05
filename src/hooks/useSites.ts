import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchSiteById, fetchSites, updateSite } from "@api/sites";

export const useGetSites = (orgId: number | null, options = {}) => {
  const query = useQuery({
    queryKey: ["sites", orgId],
    queryFn: () => fetchSites(orgId),
    enabled: !!orgId,
    ...options,
  });
  return query;
};

export const useGetSiteById = (id: number | null, options = {}) =>
  useQuery({
    queryKey: ["sites", "detail", id],
    queryFn: () => fetchSiteById(id!),
    enabled: !!id,
    ...options,
  });

export const useUpdateSite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSite,
    onSuccess: (_data, siteData) => {
      queryClient.invalidateQueries({ queryKey: ["sites"] });
      queryClient.invalidateQueries({ queryKey: ["sites", "detail", siteData.id] });
      queryClient.invalidateQueries({ queryKey: ["organisations"] });
    },
  });
};
