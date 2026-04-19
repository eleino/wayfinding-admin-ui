import { useMutation, useQuery } from "@tanstack/react-query"
import { fetchLocationById, fetchLocationDestinations, fetchLocations, createLocation } from "@api/locations";
import type { CreateLocationDTO } from "@apptypes/dtos/create-location.dto";

// so we need orgid to fetch siteid, and siteid to fetch buildingid, and buildingid to fetch locations
// so maybe a selection list for org, site, building, and then fetch locations based on building selection?
export const useGetLocations = (buildingId: number|null, options = {}) => {
    const query = useQuery({ queryKey: ["locations", buildingId], queryFn: () => fetchLocations(buildingId), enabled: !!buildingId, ...options });
    return query;
}

export const useGetLocationById = (id: number|null, options = {}) => {
    const query = useQuery({ queryKey: ["location", id], queryFn: () => fetchLocationById(id), enabled: !!id, ...options });
    return query;
}

export const useGetLocationDestinations = (id: number|null, lang?: string, accessibility_level?: string, options = {}) => {
    const query = useQuery({ queryKey: ["locationDestinations", id, lang, accessibility_level], queryFn: () => fetchLocationDestinations(id, lang, accessibility_level), enabled: !!id, ...options });
    return query;
}

export const useCreateLocation = (options = {}) => {
    const mutation = useMutation({
        mutationFn: ({ buildingId, location }: { buildingId: number; location: CreateLocationDTO }) => createLocation(buildingId, location),
        ...options,
    });
    return mutation;
}