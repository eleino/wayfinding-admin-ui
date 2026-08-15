import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createOrganisation,
  fetchOrganisationById,
  fetchOrganisations,
  updateOrganisation,
} from "@api/organisations";
import { useEffect } from "react";
import { useSelectionStore } from "@storage/store";

export const useGetOrganisations = (options = {}) => {
  const query = useQuery({
    queryKey: ["organisations"],
    queryFn: fetchOrganisations,
    ...options,
  });
  // Update the orgList in the selection store whenever the query data changes
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
  // Update the siteList in the selection store whenever the query data changes
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

export const useUpdateOrganisation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrganisation,
    onSuccess: (_data, orgData) => {
      queryClient.invalidateQueries({ queryKey: ["organisations"] });
      queryClient.invalidateQueries({ queryKey: ["organisations", orgData.id] });
    },
  });
};

export const useCreateOrganisation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      parentId,
      organisation,
    }: {
      parentId: number;
      organisation: { name: string };
    }) => createOrganisation(parentId, organisation),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["organisations"] });
      queryClient.invalidateQueries({
        queryKey: ["organisations", variables.parentId],
      });
    },
  });
};
