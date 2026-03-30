import { useQuery } from "@tanstack/react-query";
import { fetchOrganisationById, fetchOrganisations } from "@api/organisations";

export const useGetOrganisations = () => {
        const query = useQuery({ queryKey: ["organisations"], queryFn: fetchOrganisations });
        return query;
}

export const useGetOrganisationById = (id: number) => {
        const query = useQuery({ queryKey: ["organisations", id], queryFn: () => fetchOrganisationById(id) });
        return query;
}