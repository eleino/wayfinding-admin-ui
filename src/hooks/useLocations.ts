import { useMutation, useQuery } from "@tanstack/react-query"
import { fetchLocationById, fetchLocationDestinations, fetchLocations, createLocation, updateLocation, fetchEntryLocations } from "@api/locations";
import type { CreateLocationDTO } from "@apptypes/dtos/create-location.dto";
import type { UpdateLocationDTO } from "@apptypes/dtos/update-location.dto";

export const useGetLocations = (buildingId: number|null, options = {}) => {
    const query = useQuery({ queryKey: ["locations", buildingId], queryFn: () => fetchLocations(buildingId), enabled: !!buildingId, ...options });
    return query;
}

export const useGetLocationById = (id: number|null, options = {}) => {
    const query = useQuery({ queryKey: ["location", id], queryFn: () => fetchLocationById(id), enabled: !!id, ...options });
    return query;
}

export const useGetEntryLocations = (buildingId: number|null, lang = "fi", options = {}) => {
    const query = useQuery({ queryKey: ["entryLocations", buildingId, lang], queryFn: () => fetchEntryLocations(buildingId, lang), enabled: !!buildingId, ...options });
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

export const useUpdateLocation = (options = {}) => {
    const mutation = useMutation({
        mutationFn: ({ locationId, location }: { locationId: number; location: UpdateLocationDTO }) => updateLocation(locationId, location),
        ...options,
    });
    return mutation;
}
