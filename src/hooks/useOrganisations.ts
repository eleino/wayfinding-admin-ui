import { useQuery } from "@tanstack/react-query";
import { fetchOrganisationById, fetchOrganisations } from "@api/organisations";
import { useEffect } from "react";
import { useSelectionStore } from "@storage/store";

export const useGetOrganisations = (options = {}) => {
  const query = useQuery({
    queryKey: ["organisations"],
    queryFn: fetchOrganisations,
    ...options,
  });
  useEffect(() => {
    if (query.data) {
      useSelectionStore.setState({
        orgList: query.data.map((org) => ({
          id: Number(org.id),
          name: org.name,
        })),
      });
    }
  }, [query.data]);
  return query;
};

export const useGetOrganisationById = (id: number|null, options = {}) => {
  const query = useQuery({
    queryKey: ["organisations", id],
    queryFn: () => fetchOrganisationById(id),
    ...options,
  });
  useEffect(() => {
    if (query.data) {
      useSelectionStore.setState({
        siteList: query.data.sites.map((site) => ({
          id: Number(site.id),
          name: site.name,
        })),
      });
    }
  }, [query.data]);
  return query;
};
